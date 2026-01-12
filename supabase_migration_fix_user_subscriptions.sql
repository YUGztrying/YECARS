-- Migration to fix user_subscriptions table schema
-- This fixes ALL schema mismatches and RLS policy issues
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Add ALL missing columns that the subscription form requires
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

-- Step 2: Enable Row Level Security (RLS) on the table
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can update all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can delete all subscriptions" ON user_subscriptions;

-- Step 4: Create RLS policies

-- Allow authenticated users to insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions"
ON user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow any authenticated user to create subscriptions

-- Allow users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON user_subscriptions
FOR SELECT
TO authenticated
USING (user_email = auth.jwt()->>'email');

-- Allow admins to view all subscriptions
-- Note: You'll need to have a user_roles table or metadata to identify admins
-- For now, allowing service role to access all (used by admin panel)
CREATE POLICY "Service role can view all subscriptions"
ON user_subscriptions
FOR SELECT
TO service_role
USING (true);

-- Allow service role to update all subscriptions
CREATE POLICY "Service role can update all subscriptions"
ON user_subscriptions
FOR UPDATE
TO service_role
USING (true);

-- Allow service role to delete all subscriptions
CREATE POLICY "Service role can delete all subscriptions"
ON user_subscriptions
FOR DELETE
TO service_role
USING (true);

-- Step 5: Optional - If you have old data with current_period_start/end columns, migrate it
-- (Only run these if your table has current_period_start/end columns)
-- UPDATE user_subscriptions
-- SET start_date = current_period_start,
--     end_date = current_period_end
-- WHERE start_date IS NULL;

-- Step 6: Optional - Remove old columns after migration if they exist
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS current_period_start;
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS current_period_end;

-- Step 7: Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;
