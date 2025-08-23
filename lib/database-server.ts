import { createServerSupabaseClient } from './supabase-server-auth'
import type { Profile, Recipe, CreateRecipeData, UpdateProfileData, RecipeWithStats, RecipeStatsResponse } from './types'

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

// Social features functions

export async function getRecipeWithStatsServer(recipeId: string): Promise<RecipeWithStats | null> {
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

  // Get social stats
  const stats = await getRecipeStatsServer(recipeId)
  
  return {
    ...data,
    like_count: stats?.like_count || 0,
    comment_count: stats?.comment_count || 0,
    user_has_liked: stats?.user_has_liked || false
  }
}

export async function getRecipesWithStatsServer(): Promise<RecipeWithStats[]> {
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

  if (!data) return []

  // Get social stats for each recipe
  const recipesWithStats = await Promise.all(
    data.map(async (recipe) => {
      const stats = await getRecipeStatsServer(recipe.id)
      return {
        ...recipe,
        like_count: stats?.like_count || 0,
        comment_count: stats?.comment_count || 0,
        user_has_liked: stats?.user_has_liked || false
      }
    })
  )

  return recipesWithStats
}

export async function getRecipesByUserWithStatsServer(userId: string): Promise<RecipeWithStats[]> {
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

  if (!data) return []

  // Get social stats for each recipe
  const recipesWithStats = await Promise.all(
    data.map(async (recipe) => {
      const stats = await getRecipeStatsServer(recipe.id)
      return {
        ...recipe,
        like_count: stats?.like_count || 0,
        comment_count: stats?.comment_count || 0,
        user_has_liked: stats?.user_has_liked || false
      }
    })
  )

  return recipesWithStats
}

export async function getRecipeStatsServer(recipeId: string): Promise<RecipeStatsResponse | null> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // Get current user to check like status
    const { data: { user } } = await supabase.auth.getUser()
    
    // Try to use the database function first
    const { data, error } = await supabase
      .rpc('get_recipe_stats', {
        recipe_uuid: recipeId,
        user_uuid: user?.id || null
      })
      .single()

    if (!error && data) {
      return data
    }

    // Fallback: manually fetch stats if function doesn't exist
    console.warn('Database function get_recipe_stats not found, using fallback method')
    
    // Get like count
    const { count: likeCount, error: likeError } = await supabase
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId)

    if (likeError) {
      console.error('Error fetching like count:', likeError)
      return null
    }

    // Get comment count
    const { count: commentCount, error: commentError } = await supabase
      .from('recipe_comments')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId)

    if (commentError) {
      console.error('Error fetching comment count:', commentError)
      return null
    }

    // Check if user has liked this recipe
    let userHasLiked = false
    if (user) {
      const { data: userLike, error: userLikeError } = await supabase
        .from('recipe_likes')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)
        .single()

      if (userLikeError && userLikeError.code !== 'PGRST116') {
        console.error('Error checking user like status:', userLikeError)
      } else {
        userHasLiked = !!userLike
      }
    }

    return {
      recipe_id: recipeId,
      like_count: likeCount || 0,
      comment_count: commentCount || 0,
      user_has_liked: userHasLiked
    }
  } catch (error) {
    console.error('Error in getRecipeStatsServer:', error)
    return null
  }
}

