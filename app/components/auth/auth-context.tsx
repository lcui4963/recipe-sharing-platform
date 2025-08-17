'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'
import { getCurrentProfile } from '@/lib/auth'
import type { Profile } from '@/lib/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Create Supabase client for this component
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
          setProfile(null)
        } else {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            try {
              const userProfile = await getCurrentProfile()
              setProfile(userProfile)
            } catch (profileError) {
              console.error('Error fetching profile:', profileError)
              setProfile(null)
            }
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setUser(null)
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session?.user)
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            const userProfile = await getCurrentProfile()
            setProfile(userProfile)
          } catch (profileError) {
            console.error('Error fetching profile after auth change:', profileError)
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
        
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    try {
      setIsLoading(true)
      
      // Clear local state first
      setUser(null)
      setProfile(null)
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'global' // This ensures sign out from all devices/sessions
      })
      
      if (error) {
        console.error('Supabase sign out error:', error)
        // Don't throw here - we still want to clear local state and redirect
      }
      
      // Clear any local storage items that might contain auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
      }
      
      // Force page reload to clear any cached data and redirect to home
      window.location.href = '/'
    } catch (error) {
      console.error('Error during sign out:', error)
      // Even if there's an error, try to clear local state and redirect
      setUser(null)
      setProfile(null)
      window.location.href = '/'
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      try {
        const userProfile = await getCurrentProfile()
        setProfile(userProfile)
      } catch (error) {
        console.error('Error refreshing profile:', error)
      }
    }
  }

  const value = {
    user,
    profile,
    isLoading,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
