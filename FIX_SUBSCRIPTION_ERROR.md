# Fix for Subscription Error: "Could not find the 'adresse' column"

## Problem

Clients were seeing an error when trying to subscribe:
```
Could not find the 'adresse' column of 'user_subscriptions' in the schema cache
```

## Root Cause

The subscription form was trying to insert data into database columns that didn't exist:
- `adresse` (address) column - missing
- `ville` (city) column - missing
- Date columns were inconsistently named (`current_period_start/end` in form vs `start_date/end_date` in reads)

## Files Changed

1. **app/souscription-abonnement/page.tsx** (lines 113-114)
   - Fixed: Changed `current_period_start` → `start_date`
   - Fixed: Changed `current_period_end` → `end_date`
   - Now matches the TypeScript interface and all read operations

2. **supabase_migration_fix_user_subscriptions.sql** (NEW FILE)
   - SQL script to add missing columns to the database

## How to Fix

### Step 1: Run the SQL Migration

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Navigate to the SQL Editor (left sidebar)
4. Copy and paste the content of `supabase_migration_fix_user_subscriptions.sql`
5. Run the SQL script

This will add the missing columns:
- `adresse` (TEXT)
- `ville` (TEXT)
- `start_date` (TIMESTAMPTZ)
- `end_date` (TIMESTAMPTZ)

### Step 2: Verify the Fix

After running the migration, test the subscription flow:
1. Go to your website
2. Navigate to the subscription page
3. Fill out the form
4. Submit - the error should be gone

### Step 3: Check Existing Data (if applicable)

If you have existing subscriptions with `current_period_start/end` columns:
- Uncomment and run Step 3 in the SQL migration to migrate old data
- Optionally run Step 4 to clean up old columns

## Technical Details

### Database Schema (user_subscriptions table)

Required columns:
- `id` - UUID (primary key)
- `user_email` - TEXT
- `nom` - TEXT (last name)
- `prenom` - TEXT (first name)
- `telephone` - TEXT (phone)
- `adresse` - TEXT (address) **[ADDED]**
- `ville` - TEXT (city) **[ADDED]**
- `plan_id` - UUID
- `plan_name` - TEXT
- `start_date` - TIMESTAMPTZ **[STANDARDIZED]**
- `end_date` - TIMESTAMPTZ **[STANDARDIZED]**
- `status` - TEXT
- `usage_counts` - JSONB
- `is_initial_payment_collected` - BOOLEAN
- `duration_months` - INTEGER
- `price_paid` - NUMERIC

### Code Changes

The subscription form now correctly uses the same column names as the rest of the application:
- Form submission: uses `start_date` and `end_date`
- Admin panel: reads `start_date` and `end_date`
- Email API: reads `start_date` and `end_date`
- User dashboard: reads `start_date` and `end_date`

All components now consistently use the same column names.

## Prevention

To prevent this issue in the future:
1. Always ensure TypeScript interfaces match database schema
2. Use a migration system for schema changes
3. Test form submissions in a development environment before production
4. Consider using Supabase's type generation: `supabase gen types typescript`

## Support

If you encounter any issues:
1. Check the Supabase logs for detailed error messages
2. Verify the SQL migration ran successfully
3. Ensure Row Level Security (RLS) policies allow inserts to the new columns
4. Clear your browser cache and try again
