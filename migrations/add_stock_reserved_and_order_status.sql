-- Run this in Supabase Dashboard -> SQL Editor
-- Adds stock_reserved to all 8 category tables and status to orders

ALTER TABLE public."CPU" ADD COLUMN IF NOT EXISTS stock_reserved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public."GPU" ADD COLUMN IF NOT EXISTS stock_reserved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public."Motherboard" ADD COLUMN IF NOT EXISTS stock_reserved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public."Case" ADD COLUMN IF NOT EXISTS stock_reserved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public."Memory" ADD COLUMN IF NOT EXISTS stock_reserved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public."PSU" ADD COLUMN IF NOT EXISTS stock_reserved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public."CPU Cooler" ADD COLUMN IF NOT EXISTS stock_reserved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public."Internal Drive" ADD COLUMN IF NOT EXISTS stock_reserved INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public."orders" ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending_payment';
