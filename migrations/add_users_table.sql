-- Run this in Supabase Dashboard -> SQL Editor
-- Creates public.users (profile) and public.orders tables

CREATE TABLE IF NOT EXISTS public.users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON public.users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_insert ON public.users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_update ON public.users
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  build_snapshot JSONB,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_select ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY order_insert ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
