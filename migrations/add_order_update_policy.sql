-- Run this in Supabase Dashboard -> SQL Editor
-- Allows users to update their own orders (needed for confirm-payment and cancel flows)

CREATE POLICY order_update ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);
