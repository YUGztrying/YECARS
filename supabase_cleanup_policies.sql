-- Cleanup script to remove existing RLS policies
-- Run this FIRST if you get "policy already exists" errors
-- Then run the main migration script

-- Drop all existing policies on user_subscriptions table
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can update all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can delete all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can view all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can update all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can delete all subscriptions" ON user_subscriptions;

-- Verify policies are removed
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'user_subscriptions';
