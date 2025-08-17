# Database Migration Instructions

## Issue: Bio Column Missing

Your Supabase database is missing the `bio` column in the `profiles` table. Here's how to fix it:

## Option 1: Run Migration Script (Recommended)

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the contents of `database/migration_add_bio.sql`
4. Paste and execute the script

## Option 2: Manual Column Addition

1. Go to your **Supabase Dashboard**
2. Navigate to **Table Editor**
3. Select the `profiles` table
4. Click **+ Add Column**
5. Set:
   - Name: `bio`
   - Type: `text`
   - Nullable: `true` (checked)
6. Save the changes

## Option 3: Recreate Full Schema

If you have no important data:

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the entire contents of `database/schema.sql`
4. Execute the script (this will create/recreate all tables)

## Verification

After running the migration:

1. Refresh your profile page
2. You should now see the Bio field
3. Profile updates should work without errors

## Temporary Workaround

The application has been updated to gracefully handle the missing bio column:
- Bio field will be hidden if the column doesn't exist
- Profile updates will work without the bio field
- A warning message will appear indicating the migration is needed

## Need Help?

If you encounter any issues:
1. Check the browser console for detailed error messages
2. Verify your Supabase connection is working
3. Ensure you have the correct permissions in Supabase



