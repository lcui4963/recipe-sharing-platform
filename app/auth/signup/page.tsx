'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthForm } from '@/app/components/auth/auth-form'
import { signUp } from '@/lib/auth'

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (data: { 
    email: string; 
    password: string; 
    username?: string; 
    fullName?: string 
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      if (!data.username || !data.fullName) {
        throw new Error('Username and full name are required')
      }

      await signUp(data.email, data.password, {
        username: data.username,
        full_name: data.fullName,
      })
      
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Sharing</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>

        <AuthForm
          mode="signup"
          onSubmit={handleSignUp}
          isLoading={isLoading}
          error={error}
        />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
