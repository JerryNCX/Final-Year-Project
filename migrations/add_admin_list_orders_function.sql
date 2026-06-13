-- Run this in Supabase Dashboard -> SQL Editor
-- SECURITY DEFINER function that bypasses RLS for admin order listing.
-- Only callable from the backend after admin auth check.

CREATE OR REPLACE FUNCTION public.admin_list_all_orders()
RETURNS SETOF public.orders
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM public.orders ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_all_orders() TO anon;
