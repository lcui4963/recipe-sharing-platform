import { createServerSupabaseClient } from './supabase-server-auth'
import type { Profile, Recipe, CreateRecipeData, UpdateProfileData } from './types'

// Server-side database functions that use the server Supabase client
// These maintain the user session for RLS policies

export async function createRecipeServer(userId: string, recipeData: CreateRecipeData): Promise<Recipe | null> {
  const supabase = await createServerSupabaseClient()
  
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

export async function updateRecipeServer(recipeId: string, updateData: Partial<CreateRecipeData>): Promise<Recipe | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('recipes')
    .update(updateData)
    .eq('id', recipeId)
    .select()
    .single()

  if (error) {
    console.error('Error updating recipe:', error)
    return null
  }

  return data
}

export async function deleteRecipeServer(recipeId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  
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

export async function getRecipeByIdServer(recipeId: string): Promise<Recipe | null> {
  const supabase = await createServerSupabaseClient()
  
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

export async function getRecipesByUserServer(userId: string): Promise<Recipe[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!recipes_user_id_fkey (
        username,
        full_name
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user recipes:', error)
    return []
  }

  return data || []
}

export async function getRecipesServer(): Promise<Recipe[]> {
  const supabase = await createServerSupabaseClient()
  
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

  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }

  return data || []
}


