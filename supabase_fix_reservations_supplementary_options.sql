-- Fix missing supplementary_options column in reservations table
-- This column stores optional additional services selected by the user

ALTER TABLE reservations
ADD COLUMN IF NOT EXISTS supplementary_options JSONB DEFAULT '[]'::jsonb;

-- Verify the change
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'reservations'
ORDER BY ordinal_position;
