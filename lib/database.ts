import { supabase } from './supabase'
import type { Profile, Recipe, CreateRecipeData, UpdateProfileData } from './types'

// Debug function to test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // First check if environment variables are present
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Database connection test failed: Missing environment variables', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        url: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing'
      })
      return false
    }

    // Test basic connectivity with a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Database connection test failed:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        supabaseUrl: supabaseUrl?.substring(0, 30) + '...'
      })
      return false
    }

    console.log('Database connection test passed:', {
      profilesAccessible: true,
      rowCount: data?.length || 0
    })
    return true
  } catch (err) {
    console.error('Database connection test error:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      name: err instanceof Error ? err.name : 'Unknown',
      stack: err instanceof Error ? err.stack : undefined,
      error: err
    })
    return false
  }
}

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    return null
  }

  return data
}

// Check if bio column exists in profiles table
export async function checkBioColumnExists(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('bio')
      .limit(1)

    // If there's no error, the column exists
    return !error
  } catch (err) {
    console.log('Bio column check failed:', err)
    return false
  }
}

export async function updateProfile(userId: string, updates: UpdateProfileData): Promise<Profile | null> {
  console.log('Attempting to update profile for user:', userId, 'with updates:', updates)
  
  try {
    // First check if profile exists
    const existingProfile = await getProfile(userId)
    if (!existingProfile) {
      console.error('Profile not found for user:', userId)
      throw new Error('Profile not found. Please ensure your profile is properly created.')
    }

    // Check if bio column exists
    const bioColumnExists = await checkBioColumnExists()
    console.log('Bio column exists:', bioColumnExists)

    // Prepare the update data, ensuring we don't update with undefined values
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    // Only include fields that are actually provided and not empty
    if (updates.username !== undefined && updates.username.trim() !== '') {
      updateData.username = updates.username.trim()
    }
    if (updates.full_name !== undefined && updates.full_name.trim() !== '') {
      updateData.full_name = updates.full_name.trim()
    }
    
    // Only include bio if the column exists and bio is in updates
    if (updates.bio !== undefined && bioColumnExists) {
      updateData.bio = updates.bio.trim() || null
    } else if (updates.bio !== undefined && !bioColumnExists) {
      console.warn('Bio update skipped - bio column does not exist in database')
    }

    console.log('Prepared update data:', updateData)

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating profile:', {
        error,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        userId,
        updates,
        updateData
      })
      
      // Handle bio column missing error specifically
      if (error.message && error.message.includes("'bio' column")) {
        throw new Error('Bio field is not supported yet. Please update your database schema by running the migration script.')
      }
      
      // Provide more specific error messages based on common Supabase errors
      let errorMessage = 'Failed to update profile'
      if (error.code === '23505') {
        errorMessage = 'Username is already taken. Please choose a different username.'
      } else if (error.code === '23514') {
        errorMessage = 'Invalid data provided. Please check your input and try again.'
      } else if (error.message) {
        errorMessage = `Failed to update profile: ${error.message}`
      }
      
      throw new Error(errorMessage)
    }

    if (!data) {
      console.error('No data returned from profile update')
      throw new Error('Profile update failed - no data returned')
    }

    console.log('Profile updated successfully:', data)
    return data
  } catch (err) {
    console.error('Error in updateProfile function:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      userId,
      updates
    })
    throw err
  }
}

// Recipe functions
export async function getRecipes(limit = 20, offset = 0): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!recipes_user_id_fkey (
        username,
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }

  return data || []
}

export async function getRecipeById(recipeId: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!recipes_user_id_fkey (
        username,
        full_name
      )
    `)
    .eq('id', recipeId)
    .single()

  if (error) {
    console.error('Error fetching recipe:', error)
    return null
  }

  return data
}

export async function getRecipesByUser(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user recipes:', error)
    return []
  }

  return data || []
}

export async function createRecipe(userId: string, recipeData: CreateRecipeData): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      ...recipeData,
      user_id: userId
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating recipe:', error)
    return null
  }

  return data
}

export async function updateRecipe(recipeId: string, updates: Partial<CreateRecipeData>): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', recipeId)
    .select()
    .single()

  if (error) {
    console.error('Error updating recipe:', error)
    return null
  }

  return data
}

export async function deleteRecipe(recipeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)

  if (error) {
    console.error('Error deleting recipe:', error)
    return false
  }

  return true
}

// Search functions
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!recipes_user_id_fkey (
        username,
        full_name
      )
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,ingredients.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching recipes:', error)
    return []
  }

  return data || []
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!recipes_user_id_fkey (
        username,
        full_name
      )
    `)
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching recipes by category:', error)
    return []
  }

  return data || []
}
