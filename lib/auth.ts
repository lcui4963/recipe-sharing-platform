import { supabase } from './supabase'
import { createProfile, getProfile, updateProfile } from './database'
import type { Profile, UpdateProfileData } from './types'

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
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
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    throw new Error(error.message)
  }
}

export async function updateCurrentProfile(updates: UpdateProfileData): Promise<Profile | null> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('No authenticated user')
  }
  
  return await updateProfile(user.id, updates)
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
