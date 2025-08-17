-- Migration to add bio column to profiles table
-- Run this if your profiles table doesn't have the bio column

-- Add bio column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'bio'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN bio text;
        RAISE NOTICE 'Bio column added to profiles table';
    ELSE
        RAISE NOTICE 'Bio column already exists in profiles table';
    END IF;
END $$;



