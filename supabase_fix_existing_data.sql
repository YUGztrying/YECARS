-- Fix existing subscription data
-- This migrates data from old columns to new columns and adds missing timestamps

-- Step 1: Add created_at and updated_at if they don't exist
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Add start_date and end_date if they don't exist
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- Step 3: Migrate data from current_period_start/end to start_date/end_date
UPDATE user_subscriptions
SET
    start_date = current_period_start,
    end_date = current_period_end,
    created_at = COALESCE(created_at, current_period_start, NOW()),
    updated_at = COALESCE(updated_at, current_period_start, NOW())
WHERE start_date IS NULL OR end_date IS NULL;

-- Step 4: Verify the fix
SELECT
    id,
    user_email,
    plan_id,
    status,
    start_date,
    end_date,
    created_at,
    updated_at
FROM user_subscriptions
ORDER BY created_at DESC;
