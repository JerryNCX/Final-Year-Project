# Task.md — PC Builder + Compatibility

## Goal
Ship a full PC part catalog/builder with Supabase 8-table backend, PC Builder with PCPartPicker-style compatibility, admin stock management, and deprecated table migration complete.

## Progress This Session (Session 4)

### Backend — Admin endpoints (DONE)
- `PUT /admin/products/{table}/{id}` — update stock/price/manufacturer/image_urls (tested and working)
- `DELETE /admin/products/{table}/{id}` — delete product (tested, returns 404 for non-existent)
- `update_product()` / `delete_product()` in supabase.py

### Frontend — Admin rewrite (DONE)
- `ProductManagement.jsx` — fully rewritten to use `searchProducts()` / `getCategories()` from `@/lib/api`, no longer imports from `@/lib/supabase`
- `ProductCard.jsx` — rewritten: uses `adminUpdateProduct` / `adminDeleteProduct` from `@/lib/api`, inline stock editing with save button, removed old category dropdown
- `@/lib/api.js` — added `adminUpdateProduct()` and `adminDeleteProduct()` wrappers
- `vite.config.js` — added `/admin` proxy route

### Supabase client extraction (DONE)
- Created `src/lib/supabase-client.js` — just the Supabase client creation (for auth usage)
- `SignUpPage.jsx` — updated to import from `@/lib/supabase-client`
- **Deleted `src/lib/supabase.js`** (deprecated — was only querying `Product_Catalog`)

### Migration file created
- `migrations/add_stock_column.sql` — ALTER TABLE for all 8 tables, ready to run in Supabase SQL Editor

### Admin pathway added
- `Footer.jsx` — "Admin Portal" link in Support section, goes to `/admin/login`
- `App.jsx` — `/admin` now redirects to `/admin/products` (index route)

## Completed (Session 5+)

### Phase 1 — Shopping Flow (DONE)
- Created `src/lib/CartContext.jsx` — React Context with `addToCart(build)`, `updateQuantity()`, `removeFromCart()`, `clearCart()`, `cartCount`, `subtotal`, `tax`, `cartTotal`
- `App.jsx` — wrapped routes with `<CartProvider>`
- `PCBuildPage.jsx` — "PROCEED TO CHECKOUT" button now calls `addToCart(build)` → `navigate('/cart')`
- `ShoppingCart.jsx` — rewritten: reads from `useCart()` instead of hardcoded `initialItems`, empty state with "Build a System" button, "Execute Order" navigates to `/checkout`
- `Checkout.jsx` — rewritten: reads from `useCart()` instead of hardcoded `cartItems`, form has `onSubmit` → `clearCart()` → navigate to `/build`, added `required` to form fields
- `Header.jsx` — reads `cartCount` from `CartContext` directly (no prop drilling)
- Removed unused imports (`Share2`, `Save`, `Loader2`) from `PCBuildPage.jsx`

### Checkout Improvements (Parked — do after Phase 2)
1. **Auth gate on Checkout** — require user to be logged in before accessing `/checkout`; redirect to `/login` if not authenticated
2. **Email auto-fill** — remove manual email input, use authenticated user's email from Supabase Auth
3. **Shipping address auto-fill** — create `user_addresses` Supabase table + backend GET/PUT endpoints; on checkout mount, fetch saved address → auto-fill; if no address, leave empty with `required`
4. **Delivery Velocity calculation** — backend `POST /shipping/calculate` taking `{city, state, zip}` → returns costs/days; frontend updates prices dynamically on city/zip change

### Phase 2 — Persist Builds (DONE)
- `BuildContext.jsx` — rewritten: loads/saves build to `localStorage` on every change; added `savedBuilds` (local) + `cloudBuilds` (Supabase) arrays; `saveCurrentBuild(name)`, `loadLocalBuild(id)`, `deleteLocalBuild(id)`, `deleteCloudBuild(id)`, `applyBuild(data)`, `refreshCloudBuilds()`
- `migrations/add_builds_table.sql` — creates `public.user_builds` table (id UUID, user_id UUID FK, name TEXT, components JSONB, timestamps) with RLS policies per user
- Backend `supabase.py` — added `save_user_build()`, `list_user_builds()`, `get_user_build()`, `delete_user_build()`
- Backend `main.py` — added `POST /api/builds`, `GET /api/builds`, `GET /api/builds/{id}`, `DELETE /api/builds/{id}` (all require Bearer JWT, extract user_id via `_sb.auth.get_user(token)`)
- `api.js` — added `saveBuild()`, `listBuilds()`, `getBuild()`, `deleteBuild()` (all forward JWT from `getAccessToken()`)
- `vite.config.js` — added `/api` proxy → `localhost:8000`
- `PCBuildPage.jsx` — added Save modal (name input → `saveCurrentBuild`), Load panel (lists local + cloud saves with Load/Delete), Share button (copies URL)

## Completed (Session 6 — Checkout Improvements)
1. **Migration `add_users_table.sql`** — creates `public.users` (profile) and `public.orders` tables with RLS
2. **Backend `supabase.py`** — added `sync_user_profile()`, `get_user_profile()`, `upsert_user_profile()`, `create_order()`, `list_user_orders()`, `calculate_shipping()` (Malaysia zip heuristic)
3. **Backend `main.py`** — added `POST /api/users/sync`, `GET /api/users/profile`, `PUT /api/users/profile`, `GET /api/orders`, `POST /api/orders`, `POST /shipping/calculate`
4. **Frontend `api.js`** — added `syncUserProfile()`, `getUserProfile()`, `updateUserProfile()`, `createOrder()`, `listOrders()`, `calculateShipping()`
5. **Frontend `SignUpPage.jsx`** — calls `syncUserProfile(email)` after successful signup
6. **Frontend `Checkout.jsx`** — full rewrite:
   - Auth gate: redirects to `/login?redirect=/checkout` if not authenticated
   - Email auto-fill: reads `user.email` from `useAuth()`, displayed as read-only
   - Shipping address: pre-fills from `GET /api/users/profile` on mount; saves via `PUT /api/users/profile` on submit
   - Apt/Unit/Suite field added
   - Malaysia states dropdown (all 16 states/territories)
   - Zip-based delivery velocity: calls `POST /shipping/calculate` on zip change (500ms debounce), updates Standard/Express costs and transit days dynamically
   - Order creation: on submit, saves address to profile + creates order with build snapshot

## Remaining Work
1. **Run `add_users_table.sql` in Supabase SQL Editor** (needed for checkout + profile)
2. **Run `add_builds_table.sql` in Supabase SQL Editor** (needed for cloud save)

## Key Context
- Backend: `C:\Users\Admin\Desktop\FYP Dataset\backend\app\main.py`
- Backend supabase: `C:\Users\Admin\Desktop\FYP Dataset\backend\app\services\supabase.py`
- Frontend source: `C:\Users\Admin\Desktop\Final Year Project\src\`
- Vite proxy: `C:\Users\Admin\Desktop\Final Year Project\vite.config.js`
- Server: `py -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8001` (or 8000 via npm run dev)
- `PYTHONPATH` must be set to `C:\Users\Admin\Desktop\FYP Dataset`
