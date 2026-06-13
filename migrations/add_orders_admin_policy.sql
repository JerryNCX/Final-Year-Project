-- Run this in Supabase Dashboard -> SQL Editor
-- Allows admin users to view all orders

CREATE POLICY admin_select_orders ON public.orders
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users)
  );
