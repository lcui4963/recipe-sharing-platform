# Recipe Sharing Platform

A modern recipe sharing platform built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 User authentication and profiles
- 📝 Create, edit, and delete recipes
- 🔍 Search recipes by title, description, or ingredients
- 📱 Responsive design with modern UI
- ⚡ Fast performance with Next.js App Router
- 🛡️ Row Level Security with Supabase

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd recipe-sharing-platform
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to Settings > API to find your credentials

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Set up the database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL to create the tables, indexes, and policies

### 6. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
recipe-sharing-platform/
├── app/                    # Next.js App Router pages
├── lib/                    # Utility functions and configurations
│   ├── auth.ts            # Authentication utilities
│   ├── database.ts        # Database operations
│   ├── supabase.ts        # Supabase client
│   ├── supabase-server.ts # Server-side Supabase client
│   └── types.ts           # TypeScript type definitions
├── database/              # Database schema and migrations
│   └── schema.sql         # Complete database schema
└── public/                # Static assets
```

## Database Schema

### Profiles Table
- `id` (UUID, Primary Key) - References auth.users
- `username` (Text, Unique) - User's unique username
- `full_name` (Text) - User's full name
- `created_at` (Timestamp) - Account creation time
- `updated_at` (Timestamp) - Last update time

### Recipes Table
- `id` (UUID, Primary Key) - Auto-generated recipe ID
- `user_id` (UUID, Foreign Key) - References profiles.id
- `title` (Text) - Recipe title
- `description` (Text, Optional) - Recipe description
- `ingredients` (Text) - Recipe ingredients
- `instructions` (Text) - Cooking instructions
- `cooking_time` (Integer, Optional) - Cooking time in minutes
- `difficulty` (Text, Optional) - 'easy', 'medium', or 'hard'
- `category` (Text, Optional) - Recipe category
- `created_at` (Timestamp) - Recipe creation time

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Remember to add your environment variables in the Vercel dashboard.
