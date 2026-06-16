# Stock Reservation Workflow

## Overview

Hold-through-delivery stock system. Items stay on hold from place-order until delivered.

```
stock         – Physical inventory (decremented on place-order)
stock_reserved – Inventory on hold for active orders (not yet delivered)
stock - stock_reserved – Available-to-sell (live inventory)
```

## Database State Machine

```
                    Place Order
  stock=20  ──────────────────────►  stock=19
  reserved=0    reserve 1 unit       reserved=1
                                        │
                     ┌──────────────────┼──────────────────┐
                     │                  │                  │
                     ▼                  ▼                  ▼
              Confirm Pay          Cancel (any)         Delivered
              (status only)       stock=20              stock=19
              stock=19            reserved=0            reserved=0
              reserved=1          (stock restored)      (hold released)
              (hold continues)                           (stock finalized)
```

## The 3 RPC Functions (SECURITY DEFINER)

All run as DB owner (bypass RLS), GRANTed to `anon` role.

### 1. `reserve_product_stock(tbl, pid, qty)`

```sql
UPDATE "{tbl}"
SET stock = stock - qty,
    stock_reserved = COALESCE(stock_reserved, 0) + qty
WHERE id = pid
  AND (COALESCE(stock, 0) - COALESCE(stock_reserved, 0)) >= qty;
```

Called by: `place_order()` → `reserve_stock()` in backend

Returns: `true` if a row was updated (stock was available), `false` if insufficient.

### 2. `confirm_product_stock(tbl, pid, qty)`

```sql
UPDATE "{tbl}"
SET stock_reserved = COALESCE(stock_reserved, 0) - qty
WHERE id = pid
  AND COALESCE(stock_reserved, 0) >= qty;
```

Called by: `confirm_payment_endpoint()` → `confirm_payment_stock()` in backend

Returns: `true` if a row was updated, `false` if nothing to release.

### 3. `release_product_stock(tbl, pid, qty)`

```sql
UPDATE "{tbl}"
SET stock = stock + qty,
    stock_reserved = COALESCE(stock_reserved, 0) - qty
WHERE id = pid
  AND COALESCE(stock_reserved, 0) >= qty;
```

Called by: `cancel_order_endpoint()` → `release_reservation()` in backend

Returns: `true` if a row was updated (reservation existed), `false` if no reservation.

## Full Transaction Flow

```
FRONTEND                  BACKEND (main.py)                 SUPABASE (RPC)
───────                   ────────────────                  ──────────────

[Checkout]
  POST /api/orders ────► 1. validate_cart_stock() ──────►  SELECT stock FROM CPU...
                          2. reserve_stock()      ──────►  reserve_product_stock()
                          3. create_order()       ──────►  INSERT INTO orders
  ◄── { order_id }                                   │       status = pending_payment

[PaymentPage]
  POST /api/orders/    4. update_order_status()   ──────►  UPDATE orders SET status='confirmed'
       {id}/confirm    (no stock action — item stays on hold)
  ◄── { success: true }

  POST /api/orders/    4. release_reservation()   ──────►  release_product_stock()
       {id}/cancel     5. update_order_status()   ──────►  UPDATE orders SET status='cancelled'
  ◄── { success: true }

[Admin Panel]
  PUT /admin/orders/   Transitions with stock effects:
       {id}              pending_payment ─► confirmed      (no stock action)
  ◄── { success: true }  any              ─► cancelled       release_reservation()
                          any              ─► delivered       confirm_payment_stock()
```

## Key Files

| File | Role |
|------|------|
| `backend/app/main.py` | `place_order()` (line 857), `confirm_payment_endpoint()` (line 911), `cancel_order_endpoint()` (line 930), `admin_update_order()` (line 662), `VALID_ADMIN_TRANSITIONS` (line 651) |
| `backend/app/services/supabase.py` | `validate_cart_stock()` (line 251), `reserve_stock()` (line 283), `confirm_payment_stock()` (line 293), `release_reservation()` (line 303), `update_order_status()` (line 313) |
| `migrations/add_stock_reserved_and_order_status.sql` | Adds `stock_reserved` column to 8 product tables + `status` column to `orders` |
| `migrations/add_stock_rpc_functions.sql` | Creates the 3 SECURITY DEFINER functions |
| `migrations/add_admin_update_order_policy.sql` | Creates `admin_update_orders` RLS policy |
| `migrations/add_order_update_policy.sql` | Creates `order_update` RLS policy (user can update own orders) |
| `migrations/seed_stock_modern.sql` | Seeds random 0-20 stock for modern-gen products |
| `src/lib/api.js` | `createOrder()`, `confirmPayment()`, `cancelOrder()`, `adminUpdateOrderStatus()` |
| `src/frontendReusedComponents/Cart/Checkout.jsx` | 2-step checkout, calls `createOrder()`, navigates to `/payment/:orderId` |
| `src/frontendReusedComponents/Cart/PaymentPage.jsx` | Confirm/Cancel buttons, calls `confirmPayment()` / `cancelOrder()` |

## Stock Visibility (Frontend)

- **Product Card badges**: Green "In Stock" (>5), Amber "Low Stock: X" (1-5), Red "Out of Stock" (0)
- **ChooseComponent**: "Out of Stock" replaces "Add" button when stock ≤ 0
- **In Stock First**: permanent default — all searches use `ORDER BY stock DESC NULLS LAST`
- **Stock validation at checkout**: `validate_cart_stock()` checks every cart item before reserving; returns 400 with per-item breakdown if stock insufficient

## Configuration

- `backend/app/config.py`: `SUPABASE_KEY` reads from `SUPABASE_KEY` → `VITE_SUPABASE_ANON_KEY` → `VITE_SUPABASE_PUBLISHABLE_KEY`. Must resolve to a valid anon key for RPC calls to work.
- **Use `start_backend.py`** to launch the server (it `os.chdir()` to the correct working directory so `load_dotenv()` finds `.env`). If starting uvicorn directly, set env vars explicitly:
  ```
  $env:SUPABASE_URL="https://..."
  $env:SUPABASE_KEY="sb_publishable_..."
  ```
- `backend/app/services/supabase.py`: `_supabase = create_client(url, key)` — the global anon client used by all 3 stock RPC functions. Authenticated `client` parameter is accepted but NOT used by these functions.
- `backend/app/main.py`: `_sb.auth.get_user(token)` — separate `_sb` client for JWT verification only.

## Valid Admin Transitions

```
pending_payment ──► confirmed, cancelled
confirmed       ──► processing, cancelled, delivered
processing      ──► shipped, cancelled, delivered
shipped         ──► delivered, cancelled
delivered       ──► (terminal — no transitions out)
cancelled       ──► (terminal — no transitions out)
```

Stock effects on transition:

| To status | Stock action |
|-----------|-------------|
| `delivered` | `confirm_payment_stock()` — clears the hold (stock stays decremented) |
| `cancelled` | `release_reservation()` — restores stock |
| all others | none — item stays on hold |

## Verified Test Results

```
Phase 3 (Place → Confirm):
  BEFORE:  stock=16, reserved=2
  RESERVE: stock=15, reserved=3   ✅  (stock -1, reserved +1)
  CONFIRM: stock=15, reserved=3   ✅  (no stock change — hold continues)
  DELIVER: stock=15, reserved=2   ✅  (reserved -1, hold released)

Phase 4 (Place → Cancel):
  BEFORE:  stock=20, reserved=0
  RESERVE: stock=19, reserved=1   ✅
  CANCEL:  stock=20, reserved=0   ✅  (fully restored)

Admin status change:
  pending_payment → confirmed → delivered  ✅  (hold released on delivered)
  pending_payment → cancelled               ✅  (stock restored)
```
