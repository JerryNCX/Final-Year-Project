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
- `PCBuildPage.jsx` — 8-slot builder, compatibility badges, wait/PSU rec, save/load/share, centered overlay replace-confirmation modal
- `ChooseComponent.jsx` — pagination (prev/next + page numbers), search, sort, error retry
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
- `BuildContext.jsx` — localStorage + cloud persistence, local/cloud save arrays, apply/delete/refresh
- `CartContext.jsx` — anonymous cart in localStorage, authenticated sync to Supabase (800ms debounce), auto-merge on login (sums matching), conflict detection, `addToCart`/`replaceBuild`/`addCatalogItem`/`updateQuantity`/`removeFromCart`/`clearCart`
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

## Remaining Work

### Currency — Malaysia Ringgit (RM) — DONE
- Created `src/lib/currency.js` — `formatPrice()` multiplies by `USD_TO_MYR = 4.40`, prefixes `RM`
- Replaced all 5 local `formatPrice`/`parsePrice` definitions with import from `@/lib/currency`
- Updated direct `$` in JSX: `ProductCatalog.jsx` (filter labels), `SearchPopover.jsx`, `ChooseComponent.jsx`, `Checkout.jsx` (4 locations)
- Updated `Checkout.jsx` default shipping cost (24 → 106), `USD` label → `MYR`
- Updated backend shipping costs in `supabase.py` (all × 4.40)
- Updated hardcoded prices in `HomePage.jsx` and `Wishlist.jsx`
- Updated `ProductDetail.jsx` "over $500" → "over RM2,200"
- Added `formatPrice()` wrapping for raw `{product.price}` in: `ProductCatalog.jsx`, `ProductDetail.jsx`, `CategoryPage.jsx`, `SearchPopover.jsx`, `ProductManagement.jsx` (5 files)
- Replace all `$` price displays with `RM`
- Update shipping cost values in `calculate_shipping()` to realistic RM amounts
- Update any hardcoded dollar amounts in frontend/components

### Polish & UX
1. **Homepage PC Builder CTA** — Add hero section card linking to `/build`
2. **Wishlist** — Audit `/wishlist` route
3. **Empty states** — Improve empty states for cart, builds list, order history
4. **Stock validation at checkout** — Check stock before placing order, warn/block OOS

### Admin Enhancements
5. **Order status management** — Admin updates status (processing/shipped/delivered); shown in account
6. **Persist shipping data** — Add `shipping_cost` + `delivery_method` columns to `orders` table

### New Features
7. **Rebuild from order** — "Rebuild this order" button in order history
8. **Product reviews/ratings

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
