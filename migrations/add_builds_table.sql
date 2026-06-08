-- Run this in Supabase Dashboard -> SQL Editor
-- Creates user_builds table for saving PC builds per user

CREATE TABLE IF NOT EXISTS public.user_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  components JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON public.user_builds
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_insert ON public.user_builds
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_update ON public.user_builds
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_delete ON public.user_builds
  FOR DELETE USING (auth.uid() = user_id);
