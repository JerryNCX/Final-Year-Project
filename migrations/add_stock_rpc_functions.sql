-- Run this in Supabase Dashboard -> SQL Editor
-- SECURITY DEFINER functions for atomic stock operations (bypasses RLS)

CREATE OR REPLACE FUNCTION public.reserve_product_stock(tbl TEXT, pid INTEGER, qty INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cnt INTEGER;
BEGIN
  EXECUTE format(
    'UPDATE %I SET stock = stock - $1, stock_reserved = COALESCE(stock_reserved, 0) + $1 WHERE id = $2 AND (COALESCE(stock, 0) - COALESCE(stock_reserved, 0)) >= $1',
    tbl
  ) USING qty, pid;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  RETURN cnt > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.confirm_product_stock(tbl TEXT, pid INTEGER, qty INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cnt INTEGER;
BEGIN
  EXECUTE format(
    'UPDATE %I SET stock_reserved = COALESCE(stock_reserved, 0) - $1 WHERE id = $2 AND COALESCE(stock_reserved, 0) >= $1',
    tbl
  ) USING qty, pid;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  RETURN cnt > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_product_stock(tbl TEXT, pid INTEGER, qty INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cnt INTEGER;
BEGIN
  EXECUTE format(
    'UPDATE %I SET stock = stock + $1, stock_reserved = COALESCE(stock_reserved, 0) - $1 WHERE id = $2 AND COALESCE(stock_reserved, 0) >= $1',
    tbl
  ) USING qty, pid;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  RETURN cnt > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reserve_product_stock TO anon;
GRANT EXECUTE ON FUNCTION public.confirm_product_stock TO anon;
GRANT EXECUTE ON FUNCTION public.release_product_stock TO anon;
