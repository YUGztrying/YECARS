-- Migration to fix user_subscriptions table schema
-- This fixes the schema mismatch causing the 'adresse' column error
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Add the missing 'adresse' and 'ville' columns
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS adresse TEXT,
ADD COLUMN IF NOT EXISTS ville TEXT;

-- Step 2: Ensure start_date and end_date columns exist
-- (The code has been updated to use start_date/end_date consistently)
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- Step 3: If you have old data with current_period_start/end columns, migrate it
-- (Only run these if your table has current_period_start/end columns)
-- UPDATE user_subscriptions
-- SET start_date = current_period_start,
--     end_date = current_period_end
-- WHERE start_date IS NULL;

-- Step 4: (Optional) Remove old columns after migration
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS current_period_start;
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS current_period_end;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;
