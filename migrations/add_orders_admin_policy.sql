-- Run this in Supabase Dashboard -> SQL Editor
-- Allows admin users to view all orders

CREATE POLICY admin_select_orders ON public.orders
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
  );