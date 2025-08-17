# Authentication System

This document describes the authentication system implemented for the Recipe Sharing Platform.

## Overview

The authentication system is built using Supabase Auth with React Context for state management. It provides a complete authentication flow including sign up, sign in, sign out, and profile management.

## Components

### Core Components

- **AuthProvider** (`app/components/auth/auth-provider.tsx`)
  - Manages authentication state using React Context
  - Provides user and profile data to the entire app
  - Handles auth state changes and session management

- **AuthForm** (`app/components/auth/auth-form.tsx`)
  - Reusable form component for both sign in and sign up
  - Handles form validation and submission
  - Supports password visibility toggle

- **ProtectedRoute** (`app/components/auth/protected-route.tsx`)
  - Wrapper component that protects routes from unauthenticated access
  - Redirects to sign in page if user is not authenticated
  - Shows loading state while checking authentication

- **UserProfile** (`app/components/auth/user-profile.tsx`)
  - Displays and allows editing of user profile information
  - Handles profile updates and sign out functionality

### Pages

- **Sign In** (`app/auth/signin/page.tsx`)
  - Sign in page with form validation
  - Redirects to dashboard on successful authentication

- **Sign Up** (`app/auth/signup/page.tsx`)
  - Registration page with profile creation
  - Creates user account and profile in one step

- **Dashboard** (`app/dashboard/page.tsx`)
  - Protected page showing user profile and quick actions
  - Only accessible to authenticated users

## Usage

### Setting up Authentication

1. Wrap your app with the `AuthProvider` in the root layout:

```tsx
import { AuthProvider } from '@/app/components/auth/auth-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Using Authentication in Components

```tsx
import { useAuth } from '@/app/components/auth/auth-provider'

function MyComponent() {
  const { user, profile, signOut } = useAuth()
  
  if (!user) {
    return <div>Please sign in</div>
  }
  
  return (
    <div>
      <h1>Welcome, {profile?.username}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/app/components/auth/protected-route'

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

## API Functions

The authentication system uses functions from `lib/auth.ts`:

- `getCurrentUser()` - Get the current authenticated user
- `getCurrentProfile()` - Get the current user's profile
- `signUp(email, password, profileData)` - Create a new user account
- `signIn(email, password)` - Sign in with email and password
- `signOut()` - Sign out the current user
- `updateCurrentProfile(updates)` - Update the current user's profile
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword)` - Update user's password

## Database Schema

The authentication system works with the following database tables:

### profiles
- `id` (UUID, references auth.users.id)
- `username` (VARCHAR, unique)
- `full_name` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Security Features

- Password visibility toggle for better UX
- Form validation and error handling
- Protected routes with automatic redirects
- Session management with Supabase
- Profile data validation

## Styling

The authentication components use:
- Tailwind CSS for styling
- Shadcn UI components for consistent design
- Lucide React icons
- Responsive design for mobile and desktop

## Error Handling

- Comprehensive error messages for authentication failures
- Loading states during authentication operations
- Error boundaries for unexpected errors
- Graceful fallbacks for missing data

## Future Enhancements

- Email verification flow
- Social authentication (Google, GitHub, etc.)
- Two-factor authentication
- Password strength requirements
- Account deletion functionality
- Email preferences management
