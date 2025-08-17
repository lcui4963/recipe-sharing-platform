# Database Connection Troubleshooting Guide

## Error: Database connection test failed: {}

This error indicates that your Supabase database connection is not properly configured.

## Quick Fix Steps:

### 1. Check Environment Variables
Your `.env.local` file must contain:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Get Your Supabase Credentials
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** > **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Restart Development Server
After updating `.env.local`:
```bash
npm run dev
```

### 4. Verify Database Schema
Make sure your Supabase project has the required tables:
- `profiles` table
- `recipes` table

Run the SQL schema from `database/schema.sql` in your Supabase SQL Editor if needed.

### 5. Check Row Level Security (RLS)
If tables exist but queries fail, check RLS policies:
1. Go to **Table Editor** in Supabase
2. Select `profiles` table
3. Click **Settings** > **RLS**
4. Ensure appropriate policies are enabled

## Debugging Tools

### Use Built-in Debug Pages:
- `/debug` - Comprehensive database diagnostics
- `/test-supabase` - Basic connection test

### Browser Console
Check the browser console for detailed error messages:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for Supabase-related errors

## Common Issues:

1. **Environment variables not loaded**: Restart dev server
2. **Wrong project URL**: Check project ID in Supabase dashboard
3. **Invalid API keys**: Regenerate keys in Supabase settings
4. **RLS blocking queries**: Update RLS policies
5. **Table doesn't exist**: Run database schema migrations

## Still Having Issues?

If the problem persists after following these steps, run the debug tool at `/debug` and check the detailed error messages in the browser console.


