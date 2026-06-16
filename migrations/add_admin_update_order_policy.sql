-- Run this in Supabase Dashboard -> SQL Editor
-- Allows admin users to update all orders (status management)

CREATE POLICY admin_update_orders ON public.orders
  FOR UPDATE USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
  );
