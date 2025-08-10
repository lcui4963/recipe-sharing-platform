# Database Setup Instructions

## Prerequisites
1. Make sure you have Supabase CLI installed
2. Have your Supabase project created and running

## Setup Steps

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 2. Environment Variables
Create a `.env.local` file in your project root with:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Schema
Copy and paste the contents of `schema.sql` into your Supabase SQL editor and run it.

## Database Schema

### Profiles Table
- `id` (UUID, Primary Key) - References auth.users
- `username` (TEXT, Unique) - User's display name
- `full_name` (TEXT) - User's full name
- `created_at` (TIMESTAMP) - Record creation time
- `updated_at` (TIMESTAMP) - Last update time

### Recipes Table
- `id` (UUID, Primary Key) - Auto-generated
- `created_at` (TIMESTAMP) - Record creation time
- `user_id` (UUID) - References profiles.id
- `title` (TEXT) - Recipe title
- `ingredients` (TEXT) - Recipe ingredients
- `instructions` (TEXT) - Cooking instructions
- `cooking_time` (INTEGER) - Time in minutes
- `difficulty` (TEXT) - 'easy', 'medium', or 'hard'
- `category` (TEXT) - Recipe category

## Security Features
- Row Level Security (RLS) enabled on all tables
- Users can only modify their own data
- Public read access for recipes and profiles
- Automatic timestamp updates via triggers

## Available Functions
The `lib/database.ts` file provides utility functions for:
- Profile management (get, create, update)
- Recipe management (get, create, update, delete)
- User-specific recipe queries
