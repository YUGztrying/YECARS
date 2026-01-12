-- Migration to fix user_subscriptions table schema
-- This fixes ALL schema mismatches causing subscription form errors
-- Run this SQL in your Supabase SQL Editor

-- Add ALL missing columns that the subscription form requires
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS nom TEXT,
ADD COLUMN IF NOT EXISTS prenom TEXT,
ADD COLUMN IF NOT EXISTS telephone TEXT,
ADD COLUMN IF NOT EXISTS adresse TEXT,
ADD COLUMN IF NOT EXISTS ville TEXT,
ADD COLUMN IF NOT EXISTS plan_id UUID,
ADD COLUMN IF NOT EXISTS plan_name TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'en_attente',
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_initial_payment_collected BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS duration_months INTEGER,
ADD COLUMN IF NOT EXISTS price_paid NUMERIC,
ADD COLUMN IF NOT EXISTS usage_counts JSONB DEFAULT '{}'::jsonb;

-- Optional: If you have old data with current_period_start/end columns, migrate it
-- (Only run these if your table has current_period_start/end columns)
-- UPDATE user_subscriptions
-- SET start_date = current_period_start,
--     end_date = current_period_end
-- WHERE start_date IS NULL;

-- Optional: Remove old columns after migration if they exist
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS current_period_start;
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS current_period_end;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;
