import { supabase } from './supabase'
import { createProfile, getProfile, updateProfile } from './database'
import type { Profile, UpdateProfileData } from './types'

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    // Only log errors that aren't just "no session" cases
    if (error.message !== 'Auth session missing!' && !error.message.includes('session')) {
      console.error('Error getting current user:', error)
    }
    return null
  }
  
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }
  
  return await getProfile(user.id)
}

export async function signUp(email: string, password: string, profileData: { username: string; full_name: string }) {
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) {
    throw new Error(signUpError.message)
  }

  if (user) {
    // Create profile for the new user
    const profile = await createProfile({
      id: user.id,
      username: profileData.username,
      full_name: profileData.full_name,
      bio: null,
    })

    if (!profile) {
      throw new Error('Failed to create user profile')
    }

    return { user, profile }
  }

  return { user: null, profile: null }
}

export async function signIn(email: string, password: string) {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return user
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut({
      scope: 'global' // Sign out from all devices/sessions
    })
    
    if (error) {
      console.error('Error signing out:', error)
      throw new Error(error.message)
    }
    
    // Clear any cached auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
    }
  } catch (error) {
    console.error('Error in signOut function:', error)
    throw error
  }
}

export async function updateCurrentProfile(updates: UpdateProfileData): Promise<Profile | null> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('No authenticated user')
  }
  
  console.log('Updating profile for current user:', user.id, 'with updates:', updates)
  
  try {
    const result = await updateProfile(user.id, updates)
    console.log('updateCurrentProfile result:', result)
    return result
  } catch (error) {
    console.error('Error in updateCurrentProfile:', error)
    throw error
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }
}
