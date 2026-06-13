-- Run this in Supabase Dashboard -> SQL Editor
-- Creates user_cart_items table for persisted cart

CREATE TABLE IF NOT EXISTS user_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  from_build BOOLEAN DEFAULT false,
  product_data JSONB,
  added_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_item UNIQUE (user_id, table_name, product_id, from_build)
);

ALTER TABLE user_cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY cart_select ON user_cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY cart_insert ON user_cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY cart_update ON user_cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY cart_delete ON user_cart_items
  FOR DELETE USING (auth.uid() = user_id);
