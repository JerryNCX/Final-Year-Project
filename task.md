# Task.md — PC Builder + Full E-Commerce Flow

## Goal
Ship a full PC part catalog/builder with Supabase 8-table backend, PC Builder with PCPartPicker-style compatibility, admin stock management via JWT-authenticated endpoints, end-to-end shopping flow (Builder→Cart→Checkout→Order→Confirmation), persisted cart with auth merge, user account with live data, admin order management.

## Progress

### Backend — All Endpoints (DONE)
- `GET /search` — category filter, text search, sort, pagination, real counts
- `GET /products/{table}/{id}` — product detail
- `POST /suggest` — compatibility matching (socket, form factor, TDP, memory, M.2, length)
- `GET /compatible-products` — full 19-rule CONSTRAINT_MAP, column-specific search, form factor hierarchy + reverse, PSU wattage math, M.2/drive bay multi-resolvers, PSU type inference
- `PUT /admin/products/{table}/{id}` — update stock/price/manufacturer/image_urls (Bearer JWT)
- `DELETE /admin/products/{table}/{id}` — delete product (Bearer JWT)
- `GET /admin/check` — verify JWT + check `admin_users` table
- `GET /admin/orders` — all orders via `sb.rpc("admin_list_all_orders")` (SECURITY DEFINER, bypasses RLS, route-level admin auth)
- `POST /api/builds`, `GET /api/builds`, `GET /api/builds/{id}`, `DELETE /api/builds/{id}` — JWT required
- `POST /api/users/sync`, `GET /api/users/profile`, `PUT /api/users/profile` — JWT required, email auto-fill from JWT
- `GET /api/orders`, `POST /api/orders` — JWT required
- `GET /api/orders/{order_id}` — single order by ID + user_id (JWT, 404 if not found)
- `GET /api/cart`, `POST /api/cart/sync`, `POST /api/cart/items`, `DELETE /api/cart/items/{id}`, `POST /api/cart/build`, `DELETE /api/cart` — JWT required
- `POST /shipping/calculate` — Malaysia zip heuristic (no auth)

### Backend Key Fixes
- Motherboard→Memory searches `form_factor` column instead of `name`
- `ilike` resolver uses `search_table_by_column()` when `target_key` is set
- `_reverse_form_factors()` handles newline-separated values
- `_matches_any()` avoids false matches ("ATX" ≠ "EATX")
- `place_order` wrapped in try/except — real error messages, not generic 500
- `update_user_profile` auto-fills email from JWT (fixes NOT NULL violation)
- `upsert_user_profile` fallback `data.get("email", "")` prevents NOT NULL

### SQL Migrations (run in Supabase SQL Editor)
1. `migrations/add_stock_column.sql` — ALTER TABLE for all 8 tables
2. `migrations/add_admin_rls.sql` — `admin_users` table + RLS policies
3. `migrations/add_builds_table.sql` — `user_builds` table
4. `migrations/add_users_table.sql` — `public.users` (profile) + `public.orders`
5. `migrations/add_cart_table.sql` — `user_cart_items` with UNIQUE per-user-per-product, RLS
6. `migrations/add_admin_list_orders_function.sql` — SECURITY DEFINER function `admin_list_all_orders()`

### Frontend — Components (DONE)
- `PCBuildPage.jsx` — 8-slot builder, compatibility badges, wait/PSU rec, save/load/share, centered overlay replace-confirmation modal; cloud Load button fixed
- `ChooseComponent.jsx` — pagination (prev/next + page numbers), search, sort, error retry; NaN price fixed (uses `formatPrice`)
- `ShoppingCart.jsx` — two sections (Build + Catalog items), per-item checkboxes, section master checkboxes, filtered totals
- `Checkout.jsx` — 2-step flow (Shipping → Payment), email auto-fill, address pre-fill, zip-based delivery velocity, inline errors, build snapshot with selected items
- `OrderConfirmation.jsx` — fetches from `GET /api/orders/{orderId}` on refresh fallback, loading spinner, error/not-found states
- `LoginPage.jsx` — reads `?redirect` param, unified layout with SignUpPage, password toggle, social login buttons
- `SignUpPage.jsx` — calls `syncUserProfile(email)` after signup, unified layout
- `ProtectedRoute.jsx` — calls `GET /admin/check` with Bearer token, loading/denied/redirect states
- `UserAccount.jsx` — live data from API (orders, builds, profile), 4 tabs + loading/error states
- `AdminOrders.jsx` — order table with search + sort, empty/loading/error states
- `ProductManagement.jsx` — uses `searchProducts()`/`getCategories()` from `@/lib/api`, inline stock editing
- `ProductCard.jsx` — uses `adminUpdateProduct`/`adminDeleteProduct`, inline stock editing, delete confirm modal
- `Header.jsx` — auth-aware (Login/SignUp vs user dropdown with Account + SignOut), cart count from CartContext
- `AdminLayout.jsx` — nav with Products + Orders tabs
- `Footer.jsx` — "Admin Portal" link

### Frontend — Context/State (DONE)
- `BuildContext.jsx` — localStorage + cloud persistence, local/cloud save arrays, apply/delete/refresh; cloud builds re-fetch on auth change
- `CartContext.jsx` — anonymous cart in localStorage, authenticated sync to Supabase (800ms debounce), auto-merge on login (sums matching), conflict detection, `addToCart`/`replaceBuild`/`addCatalogItem`/`updateQuantity`/`removeFromCart`/`clearCart`; `firstImage()` helper fixes missing images in cart/checkout
- `api.js` — all API wrappers, `getAccessToken()` helper, `token` option for Bearer header
- `supabase-client.js` — just exports the Supabase client (for auth)

### Frontend — Share Build via URL
- Share button base64-encodes build JSON → copies `/build?data=<encoded>`
- On mount, detects `?data=` param → decodes + `applyBuild()` → cleans URL
- No database, no backend — fully stateless

### Deleted Files
- `src/lib/supabase.js` (deprecated `Product_Catalog` queries)
- `src/lib/imageSearch.js` (dead code, logic duplicated in `api.js`)
- `src/frontendReusedComponents/Build/SharedBuildPage.jsx` (replaced by URL-encoded share)
- `migrations/add_shared_builds_table.sql` (no longer needed)

### Docs
- `docs/purchase-flow.md` — complete purchase flow document

### Bug Fixes (DONE)
- **Cloud Load button** — `PCBuildPage.jsx:392` — Empty onClick handler now calls `applyBuild(entry.components)`
- **Cloud builds stale on account switch** — `BuildContext.jsx:37-39` — Re-fetches on `isAuthenticated` change instead of once on mount
- **Cart/checkout images missing** — `CartContext.jsx:41,61` — `firstImage()` helper handles JSON string, native array, and raw URL formats
- **NaN price in ChooseComponent** — `ChooseComponent.jsx:275` — Inline `parseFloat` replaced with shared `formatPrice()` utility
- **Empty state improvements** — `ProductCatalog.jsx`, `ChooseComponent.jsx`, `ProductManagement.jsx`, `Checkout.jsx` — Added icons (SearchX, PackageX, ShoppingBag) + contextual CTAs

## Remaining Work

### Stock Visibility (DONE)
- `ProductCatalog.jsx` — Added colored stock badge overlay on product card images (green In Stock / amber Low Stock: X / red Out of Stock)
- `ProductCatalog.jsx` — Added "In Stock Only" filter checkbox in sidebar (client-side filter, shows filtered count)
- `ChooseComponent.jsx` — Added same stock badge overlay on component card images
- `ChooseComponent.jsx` — "Add" button replaced with "Out of Stock" text when stock is 0/null && <= 0
- Backend already returned `stock` in `SpecProduct` — no backend changes needed

### In Stock First Sort — Default ON (DONE)
- `supabase.py` — Added `in_stock_first` param to `search_table()`, `search_all_tables()`, `search_all_categories()`. When True, chains `.order("stock", desc=True, nullsfirst=False)` before any existing sort, producing `ORDER BY stock DESC NULLS LAST, [selected_sort]` — in-stock items always appear first, within-group sorting preserved
- `main.py` — `in_stock_first` defaults to `True` on `GET /search`, passes through to service functions
- `api.js` — `searchProducts()` defaults `in_stock_first = true`
- `ProductCatalog.jsx` — Always sends `in_stock_first: true`, no toggle UI
- `ChooseComponent.jsx` — Always sends `in_stock_first: true`, no toggle UI
- No user action needed — every search/sort automatically puts in-stock items first

### Currency — Malaysia Ringgit (RM) — DONE
- Created `src/lib/currency.js` — `formatPrice()` multiplies by `USD_TO_MYR = 4.40`, prefixes `RM`
- Updated `formatPrice()` to strip `$`/non-numeric chars from string DB prices + NaN guard
- Replaced all 5 local `formatPrice`/`parsePrice` definitions with import from `@/lib/currency`
- Updated direct `$` in JSX: `ProductCatalog.jsx` (filter labels), `SearchPopover.jsx`, `ChooseComponent.jsx`, `Checkout.jsx` (4 locations)

### Stock Validation at Checkout (DONE)
- `supabase.py` — Added `validate_cart_stock(cart_items, client)` and `decrement_stock(table_name, product_id, quantity, client)`
- `validate_cart_stock()` — iterates cart items, queries `get_product()` for current stock, returns list of failures (name, table_name, product_id, available, requested). Treats null stock as 0. Handles product not found.
- `decrement_stock()` — subtracts quantity from current stock via `update()`, clamps to minimum 0
- `main.py` — `place_order()` now validates all items first (all-or-nothing), decrements stock on success, returns 400 with `out_of_stock_items` list if any item is insufficient
- `Checkout.jsx` — Parses structured 400 error, displays per-item breakdown: "Some items are out of stock: Intel i7-13700K (0 available, 1 requested)"
- Uses `_tableName`/`_productId` from cart item frontend format (or `table_name`/`product_id` fallback)
- Updated `Checkout.jsx` default shipping cost (24 → 106), `USD` label → `MYR`
- Updated backend shipping costs in `supabase.py` (all × 4.40)
- Updated hardcoded prices in `HomePage.jsx` and `Wishlist.jsx`
- Updated `ProductDetail.jsx` "over $500" → "over RM2,200"
- Added `formatPrice()` wrapping for raw `{product.price}` in: `ProductCatalog.jsx`, `ProductDetail.jsx`, `CategoryPage.jsx`, `SearchPopover.jsx`, `ProductManagement.jsx` (5 files)
- Replace all `$` price displays with `RM`
- Update shipping cost values in `calculate_shipping()` to realistic RM amounts
- Update any hardcoded dollar amounts in frontend/components

### 🛠️ Functional Bugs
1. **ContactUs form does nothing** — `ContactUs.jsx` — No `onSubmit`, uncontrolled inputs, purely decorative
2. **HomePage newsletter form does nothing** — `HomePage.jsx:252` — `preventDefault` with zero handler logic

### 👤 User Experience
3. **ShoppingCart shows empty cart while loading** — `ShoppingCart.jsx:10` — Doesn't read `initialLoading` from CartContext, flash of empty content
4. **SignUpPage missing confirm-password field** — `SignUpPage.jsx` — Users can't catch password typos
5. **Load panel can't distinguish loading vs empty vs error** — `PCBuildPage.jsx:365` — No loading spinner for cloud builds
6. **CategoryPage errors have no retry button** — `CategoryPage.jsx:99-103` — User must navigate away and back
7. **ProductDetail errors have no retry button** — `ProductDetail.jsx:175-189` — Same, no way to retry
8. **Login/AdminLogin generic error message** — `LoginPage.jsx`, `AdminLogin.jsx` — Can't tell if email or password is wrong

### ⚠️ Error Handling & Resilience
9. **ProductCatalog silently shows "No products" on API error** — `ProductCatalog.jsx:145-148` — Error swallowed, user sees misleading empty state
10. **ProductManagement shows "No products" on API error** — `ProductManagement.jsx:46-48` — Same, no error UI for network failures
11. **BuildContext cloud builds errors silently swallowed** — `BuildContext.jsx:44` — `.catch(() => {})`, no retry mechanism
12. **CartContext has no error state exposed** — `CartContext.jsx:140-157` — Components can't show sync failures
13. **PCBuildPage compatibility errors swallowed** — `PCBuildPage.jsx:100` — `.catch(() => {})`, user gets no warning
14. **Cart sync failures silently ignored** — `CartContext.jsx:173` — `syncCart().catch(() => {})`
15. **12 empty catch blocks** — Multiple files — Should at least `console.warn`

### 🏗️ Code Quality & Maintainability
16. **Array index as key (10 files)** — ChooseComponent, SearchPopover, PCBuildPage, ProductCatalog, etc. — React anti-pattern, causes incorrect re-renders on list reorder/filter
17. **`useEffect` missing dependency** — `PCBuildPage.jsx:89-105` — `suggestions` state read but not in deps array
18. **Hardcoded route paths** — ~15+ files — No central route constants
19. **No shared validation utility** — LoginPage, SignUpPage, Checkout — Each form duplicates or skips validation logic

### 🔒 Security
20. **No client-side input validation** — LoginPage, SignUpPage, Checkout — Malformed data sent before server validates
21. **No email regex on signup/login** — SignUpPage, LoginPage — Bypassable HTML `type="email"` only
22. **No name/content sanitization** — SignUpPage — Names like `"<script>"` or 500-char strings accepted
23. **XSS via base64 build data (low risk)** — PCBuildPage.jsx:48 — `applyBuild()` accepts decoded payload from URL params

### 🚀 Performance
24. **Bundle > 500kB warning** — vite build output — Single chunk, could code-split with dynamic imports
25. **Array index keys cause unnecessary re-renders** — 10 files — Fixed keys help React's reconciliation

### 🎨 Visual / Creative Design
26. **Widen product grid** — ProductCatalog — Add `xl:grid-cols-5` for large screens
27. **Mobile order summary accordion** — Checkout.jsx:461 — Collapsible on small screens
28. **Page transitions & micro-interactions** — Various — Skeleton pulse + hover scales exist, no route transitions
29. **Product image lightbox** — ProductDetail — Click to zoom/enlarge product images

### 📐 Scalability / Architecture
30. **BuildContext cloud builds has no loading/error state** — `BuildContext.jsx:39-45` — Components can't distinguish states
31. **CartContext has no error state exposed** — `CartContext.jsx:140-157` — Components can't show sync failures
32. **Route paths duplicated across 15+ files** — Multiple — Create `src/lib/routes.js` constants file
33. **No centralized API error handling** — Multiple — Each component handles errors differently
34. **No form validation utility** — Multiple — Create `src/lib/validation.js` with shared validators

### Admin Enhancements
35. **Order status management** — Admin updates status (processing/shipped/delivered); shown in account
36. **Persist shipping data** — Add `shipping_cost` + `delivery_method` columns to `orders` table

### New Features
37. **Rebuild from order** — "Rebuild this order" button in order history
38. **Product reviews/ratings

### Seed Stock for Modern Products (DONE)
- Created `migrations/seed_stock_modern.sql` — assigns `FLOOR(RANDOM() * 21)::int` stock to modern products across all 8 categories
- Modern filters per table:
  - CPU: `lithography IN ('3 nm','4 nm','5 nm','7 nm','10 nm')` — Zen 4/5, Arrow Lake, Raptor Lake, Alder Lake, etc.
  - GPU: `memory_type IN ('GDDR7','GDDR6X','GDDR6')` — RTX 30/40/50-series, RX 6000/7000/9000
  - Motherboard: `socket IN ('LGA1851','AM5','LGA1700','AM4')` — modern AMD/Intel platforms
  - Memory: `form_factor ILIKE '%DDR5%' OR form_factor ILIKE '%DDR4%'`
  - PSU: `efficiency IN ('80+ Titanium','80+ Platinum','80+ Gold') AND wattage >= 500W`
  - Case: `type ILIKE '%Mini ITX%' OR ILIKE '%MicroATX%' OR = 'ATX Mid Tower'`
  - CPU Cooler: `cpu_socket` supports AM4/AM5/LGA1700/LGA1851
  - Internal Drive: `interface` M.2 PCIe 5.0/4.0/3.0
- Legacy products remain at stock 0 (out of stock)
- Run in Supabase SQL Editor

## Key Technical Context
- **Server**: `py -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8001` (8000 via npm run dev). PYTHONPATH must be `C:\Users\Admin\Desktop\FYP Dataset`.
- **Supabase**: anon key only — no service_role. DDL runs via Supabase SQL Editor.
- **Auth**: JWT Bearer for admin + user endpoints. `check_admin_email()` queries `admin_users` via anon key (needs SELECT policy for public). `create_authenticated_client(token)` sets JWT for PostgREST only.
- **Admin auth gate**: route-level middleware (not RLS for admin_list_all_orders). SECURITY DEFINER function bypasses RLS.
- **Malaysia shipping**: zip-based zone heuristic (first digit → zone), origin Malaysia. No carrier API dependency.
- **Email confirmation**: disabled in Supabase Auth settings for testing.
- **Cart merge**: sums quantities of matching `(table_name, product_id, from_build)` on login.
- **Order confirmation refresh**: `shipping_cost`/`delivery_method` not persisted; defaults to $0 Express on refresh. Core data (items, total, address, status) fetched from API.

## Relevant Files
- `FYP Dataset/backend/app/main.py` — all routes, CONSTRAINT_MAP, `_get_user_id_from_token()`
- `FYP Dataset/backend/app/services/supabase.py` — all DB functions (queries, builds, profiles, orders, cart, shipping)
- `FYP Dataset/backend/app/schemas.py` — SpecProduct with `stock: Optional[int]`
- `FYP Dataset/migrations/` — all SQL migration files
- `src/frontendReusedComponents/` — all UI components
- `src/lib/api.js` — all API wrappers
- `src/lib/BuildContext.jsx` — build state management
- `src/lib/CartContext.jsx` — cart state management
- `docs/purchase-flow.md` — purchase flow documentation
- `vite.config.js` — proxy config for all backend routes
