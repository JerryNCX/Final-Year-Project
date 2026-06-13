# PC Builder — Complete Purchase Flow

## 1. User Journey Map

```
Landing Page (Home)
    │
    ├──→ /catalog          Browse all components by category
    ├──→ /build            PC Builder (8 slots)
    │       │
    │       ├──→ Pick CPU → Motherboard (filtered by socket)
    │       ├──→ Pick GPU → Case (filtered by length), PSU (filtered by wattage)
    │       ├──→ Pick RAM, Cooler, Storage, PSU
    │       └──→ Save/Load builds (local + cloud)
    │
    ├──→ /cart             Review build, adjust quantities
    │       │
    │       └──→ /checkout  Auth gate → Login/Signup → Address → Delivery → Order
    │
    ├──→ /orders           View past orders (future)
    ├──→ /login            Supabase Auth
    ├──→ /signup           Supabase Auth → profile sync
    └──→ /admin/login      Admin stock management
```

---

## 2. Step-by-Step Purchase Flow

### Step 1 — Browse Catalog

| Action | Route | What happens |
|---|---|---|
| User opens site | `/` | Homepage with featured components |
| Clicks a category sidebar | `/catalog?category=CPU` | Products load from Supabase via `/search` |
| Uses search bar | — | `searchProducts()` with `q` param |
| Uses sort dropdown | — | Sends `sort_by=price_asc/price_desc/name_asc/name_desc` |
| Clicks pagination | — | Sends `limit=20&offset=N` |
| Clicks a product card | `/product/CPU/123` | Detail page with specs, stock, image gallery |
| **Backend** | `GET /search` | `search_table()` with pagination + sorting |
| **Backend** | `GET /products/{table}/{id}` | `get_product()` single product |

### Step 2 — Build a PC

| Action | Route | What happens |
|---|---|---|
| User goes to | `/build` | 8 empty slots rendered |
| Clicks empty CPU slot | `/choose/cpu` | `ChooseComponent.jsx` renders |
| Picker loads | — | If compatible component exists → `GET /compatible-products`<br>If no constraint → `GET /search?category=CPU` |
| User picks a CPU | — | `addComponent('CPU', product)` → build state updates |
| Filter activates | — | Motherboard slot now shows only AM5/AM4 socket boards |
| User picks all 8 slots | — | Full build assembled |
| Compatibility badges | — | `POST /suggest` per component → shows ✅/⚠️/⏳/❌ |
| Save modal | — | `saveCurrentBuild(name)` → localStorage + (cloud if logged in) |
| Load panel | — | Lists local + cloud builds → `loadLocalBuild(id)` or `applyBuild(data)` |
| Share button | — | Copies URL with build state |
| **Backend** | `GET /compatible-products` | CONSTRAINT_MAP applies 19 rules (socket, form factor, TDP, M.2, etc.) |
| **Backend** | `POST /suggest` | Returns suggested compatible products per category |
| **Backend** | `POST /api/builds` | `save_user_build()` with JWT |

### Step 3 — Cart

| Action | Route | What happens |
|---|---|---|
| User clicks "PROCEED TO CHECKOUT" | `/cart` | PCBuildPage calls `addToCart(build)` then `navigate('/cart')` |
| Cart renders | — | `CartContext` items listed with qty, image, price |
| User adjusts qty | — | `updateQuantity()` updates subtotal/tax/total |
| User clicks "Execute Order" | `/checkout` | Navigate to checkout |
| **Frontend** | `CartContext` | `subtotal`, `tax` (6%), `cartTotal` computed from items |

### Step 4 — Auth Gate

| Action | Route | What happens |
|---|---|---|
| Not logged in → `/checkout` | `/login?redirect=/checkout` | `useAuth().isAuthenticated` → `false` → redirect |
| User clicks "Request Account" | `/signup` | Signs up via `supabase.auth.signUp()` |
| After signup | — | `syncUserProfile(email)` → creates `public.users` row |
| User clicks "SIGN IN" | `/login` | Logs in via `useAuth().login()` |
| After login | `/checkout` | `?redirect=/checkout` param brings them back |
| **Backend** | `POST /api/users/sync` | `sync_user_profile()` upserts to `public.users` |

### Step 5 — Checkout Form

| Action | Route | What happens |
|---|---|---|
| Checkout mounts | — | `getUserProfile()` fetches saved address |
| Profile found | — | Pre-fills: first_name, last_name, address_line1, address_line2, city, state, zip |
| Profile not found | — | Empty form with `required` fields |
| Email auto-fills | — | `{user.email}` from `useAuth()`, displayed as read-only `<p>` |
| User fills address | — | All fields controlled by `form` state |
| User types zip code | — | 500ms debounce → `POST /shipping/calculate` |
| **Backend** | `GET /api/users/profile` | `get_user_profile()` returns saved address |
| **Backend** | `POST /shipping/calculate` | `calculate_shipping()` runs Malaysia zip heuristic |

### Step 6 — Delivery Velocity

| Zip range | Zone | Standard | Express |
|---|---|---|---|
| 10xxx–20xxx, 50xxx–60xxx | KL/Selangor (Central) | $0.00 (1 day) | $10.00 (same day) |
| 30xxx | Perak (North) | $5.99 (2-3 days) | $18.99 (1 day) |
| 70xxx–80xxx | Johor/Melaka (South) | $12.50 (3-5 days) | $29.99 (2-3 days) |
| 90xxx | Sabah/Sarawak (East) | $20.00 (5-7 days) | $45.00 (3-5 days) |

| Action | What happens |
|---|---|
| User sees rates | Radio labels update: "Standard $5.99 — 2-3 days" / "Express $18.99 — 1 day" |
| User selects Express | `shippingCost` updates to $18.99 |
| Order summary updates | Total recalculates with shipping: `cartTotal + shippingCost` |

### Step 7 — Place Order

| Action | Route | What happens |
|---|---|---|
| User clicks "Proceed to Inspection" | `POST /api/orders` | Button shows spinner, `e.preventDefault()` |
| Frontend calls | (1) `PUT /api/users/profile` | Save address to `public.users` |
| Frontend calls | (2) `POST /api/orders` | Create order with `shipping_address` + `build_snapshot` + `total` |
| Frontend calls | (3) `clearCart()` | Empty cart |
| Frontend calls | (4) `navigate('/order-confirmation')` | Show confirmation page |
| **Backend** | `PUT /api/users/profile` | `upsert_user_profile()` |
| **Backend** | `POST /api/orders` | `create_order()` inserts into `public.orders` |

### Step 8 — Order Confirmation (TO BUILD)

| Route | What to show |
|---|---|
| `/order-confirmation` | "Thank you, [name]! Order #abc123 placed." |
| | Order summary: items, shipping address, delivery method, total |
| | "Track Order" → `/orders/{id}` (future) |
| | "Build Another System" → `/build` |

### Step 9 — Order History (TO BUILD)

| Route | What to show |
|---|---|
| `/orders` | List of past orders, newest first |
| Each row | Order #, date, status, total |
| Click order | `/orders/{id}` → full details |
| No orders | "You haven't placed any orders yet. Start building." |

---

## 3. Data Flow Diagram

```
[User Browser]
    │
    ├── Supabase Auth (signup/login)
    │   └── JWT token stored in session
    │
    ├── React Context
    │   ├── AuthContext  →  user, isAuthenticated
    │   ├── BuildContext →  build state, saved/cloud builds
    │   └── CartContext  →  cart items, totals
    │
    ├── Backend API (FastAPI on :8000)
    │   ├── /search          ───→  supabase-py (anon)  ——→  Supabase (8 category tables)
    │   ├── /compatible-products →  CONSTRAINT_MAP      ——→  Supabase
    │   ├── /suggest          ───→  product lookup      ——→  Supabase
    │   ├── /api/users/*      ───→  JWT → auth.get_user →  public.users
    │   ├── /api/orders       ───→  JWT → auth.get_user →  public.orders
    │   ├── /api/builds       ───→  JWT → auth.get_user →  public.user_builds
    │   ├── /admin/products/* ───→  JWT → admin_users   →  (ANY category table)
    │   └── /shipping/calculate──→  zip heuristic       →  returns rates
    │
    └── Vite Proxy (dev)
        └── /api/*, /admin/*, /*  →  localhost:8000
```

---

## 4. Database Tables Summary

| Table | Purpose | Created by |
|---|---|---|
| `CPU`, `GPU`, `Motherboard`, etc. (8) | Product catalog with specs | Supabase import (original data) |
| `admin_users` | Admin email whitelist | `migrations/add_admin_rls.sql` |
| `user_builds` | Cloud-saved PC builds | `migrations/add_builds_table.sql` |
| `users` | User profile + address | `migrations/add_users_table.sql` |
| `orders` | Order history | `migrations/add_users_table.sql` |

---

## 5. Remaining To Build

| Priority | Feature | Files involved | Effort |
|---|---|---|---|
| **P0** | Order confirmation page | `src/frontendReusedComponents/Cart/OrderConfirmation.jsx` + route in `App.jsx` | ~50 lines |
| **P1** | Order history page + detail | `src/frontendReusedComponents/Orders/OrderHistory.jsx` + `OrderDetail.jsx` + routes | ~150 lines |
| **P2** | Payment step (dummy) | Update stepper in Checkout to progress through steps 2-3 | ~100 lines |
| **P2** | Empty cart → prompt to build | Better messaging on empty cart state | ~10 lines |
| **P3** | Rate limiting for shipping API | Prevent spam calls on zip change | ~5 lines (already debounced) |

---

## 6. Key Files Reference

| File | Purpose |
|---|---|
| `backend/app/main.py` | All API routes (search, suggest, compatible, admin, users, orders, shipping) |
| `backend/app/services/supabase.py` | DB queries + Malaysia shipping heuristic |
| `src/lib/api.js` | All frontend API calls |
| `src/lib/BuildContext.jsx` | Build state + localStorage persistence |
| `src/lib/CartContext.jsx` | Cart state + totals |
| `src/contexts/AuthContext.jsx` | Auth state, login/logout |
| `src/frontendReusedComponents/Cart/Checkout.jsx` | Checkout with auth gate, address, shipping |
| `src/frontendReusedComponents/Build/PCBuildPage.jsx` | PC Builder with 8 slots, compat badges |
| `src/frontendReusedComponents/Build/ChooseComponent.jsx` | Component picker with search/sort/pagination |
| `src/frontendReusedComponents/Auth/SignUpPage.jsx` | Signup form + profile sync |
| `src/frontendReusedComponents/Auth/LoginPage.jsx` | Login form |
| `migrations/add_users_table.sql` | Creates `public.users` + `public.orders` |
| `migrations/add_builds_table.sql` | Creates `public.user_builds` |
