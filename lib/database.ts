import { supabase } from './supabase'
import type { Profile, Recipe, CreateRecipeData, UpdateProfileData } from './types'

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

export async function updateProfile(userId: string, updates: UpdateProfileData): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
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
