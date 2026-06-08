-- Run this in Supabase Dashboard -> SQL Editor
-- 1. Creates admin_users table to store admin emails
-- 2. Enables RLS on all 8 category tables
-- 3. Allows public SELECT (read)
-- 4. Restricts UPDATE/DELETE to admin users only

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY anon_select ON public.admin_users FOR SELECT USING (true);

-- After running this, insert your admin email:
-- INSERT INTO public.admin_users (email) VALUES ('your-admin@example.com');

-- Enable RLS on all 8 tables
ALTER TABLE public."CPU" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."GPU" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Motherboard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Case" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Memory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PSU" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CPU Cooler" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Internal Drive" ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT (read) on all tables
CREATE POLICY public_select ON public."CPU" FOR SELECT USING (true);
CREATE POLICY public_select ON public."GPU" FOR SELECT USING (true);
CREATE POLICY public_select ON public."Motherboard" FOR SELECT USING (true);
CREATE POLICY public_select ON public."Case" FOR SELECT USING (true);
CREATE POLICY public_select ON public."Memory" FOR SELECT USING (true);
CREATE POLICY public_select ON public."PSU" FOR SELECT USING (true);
CREATE POLICY public_select ON public."CPU Cooler" FOR SELECT USING (true);
CREATE POLICY public_select ON public."Internal Drive" FOR SELECT USING (true);

-- Admin-only UPDATE policy (checks JWT email against admin_users table)
CREATE POLICY admin_update ON public."CPU" FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_update ON public."GPU" FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_update ON public."Motherboard" FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_update ON public."Case" FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_update ON public."Memory" FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_update ON public."PSU" FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_update ON public."CPU Cooler" FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_update ON public."Internal Drive" FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);

-- Admin-only DELETE policy
CREATE POLICY admin_delete ON public."CPU" FOR DELETE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_delete ON public."GPU" FOR DELETE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_delete ON public."Motherboard" FOR DELETE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_delete ON public."Case" FOR DELETE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_delete ON public."Memory" FOR DELETE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_delete ON public."PSU" FOR DELETE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_delete ON public."CPU Cooler" FOR DELETE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
CREATE POLICY admin_delete ON public."Internal Drive" FOR DELETE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
