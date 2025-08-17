# Database Setup and Migration

This directory contains the database schema and migration scripts for the Recipe Sharing Platform.

## Files

- `schema.sql` - Complete database schema with all tables, indexes, and policies
- `migration_add_bio.sql` - Migration script to add the bio column to existing profiles table

## Setup Instructions

### 1. Initial Setup

If you're setting up the database for the first time:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Execute the script

### 2. Adding Bio Column (Migration)

If you have an existing database without the bio column:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `migration_add_bio.sql`
4. Execute the script

## Database Schema

### Tables

#### profiles
- `id` (UUID) - Primary key, references auth.users.id
- `username` (TEXT) - Unique username
- `full_name` (TEXT) - User's full name
- `bio` (TEXT) - Optional user bio/description
- `created_at` (TIMESTAMP) - Record creation time
- `updated_at` (TIMESTAMP) - Record last update time

#### recipes
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to profiles.id
- `title` (TEXT) - Recipe title
- `description` (TEXT) - Optional recipe description
- `ingredients` (TEXT) - Recipe ingredients
- `instructions` (TEXT) - Recipe instructions
- `cooking_time` (INTEGER) - Cooking time in minutes
- `difficulty` (TEXT) - Difficulty level (easy/medium/hard)
- `category` (TEXT) - Recipe category
- `created_at` (TIMESTAMP) - Record creation time

## Row Level Security (RLS)

The database uses Row Level Security to ensure data privacy:

- Users can view all profiles and recipes
- Users can only update/delete their own profiles and recipes
- Users can only insert their own profiles and recipes

## Indexes

Performance indexes are created for:
- Username lookups
- User recipe queries
- Recipe creation date sorting
- Recipe category filtering
- Full-text search on recipe content

## Triggers

- Automatic `updated_at` timestamp updates when records are modified
