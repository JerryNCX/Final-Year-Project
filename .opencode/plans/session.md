# PC Builder Session

## Done
- Backend: `GET /compatible-products` with 19-rule CONSTRAINT_MAP, column-specific search via `search_table_by_column()`, form_factor hierarchy + reverse, PSU wattage math, M.2/drive bay multi-resolvers, PSU type inference
- Fixes: Motherboard→Memory searches `form_factor` column instead of `name`; `ilike` resolver uses `search_table_by_column()`; `_reverse_form_factors()` handles newline-separated values; `_matches_any()` avoids false matches
- Frontend: `BuildContext.jsx`, `ChooseComponent.jsx` (compact picker with CONSTRAINT_PAIRS filter), `PCBuildPage.jsx` (8 rows, badges, wattage), `App.jsx` (BuildProvider), `api.js` (compatibleProducts), `vite.config.js` proxy
- Verified: DDR5→DDR5 only, DDR4→DDR4 only, AM5 socket→AM5 CPUs, form_factor hierarchy working

## Remaining
- Add `stock` column to 8 Supabase tables
- Admin endpoints (PUT/DELETE)
- Rewrite `ProductManagement.jsx`
- Display stock on catalog + detail pages

## Resume Command
```
Continue from task.md
```
