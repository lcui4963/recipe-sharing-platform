'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUserServer, createServerSupabaseClient } from '@/lib/supabase-server-auth'
import type { 
  LikeToggleResponse, 
  RecipeComment, 
  CreateCommentData, 
  UpdateCommentData,
  CommentWithStats 
} from '@/lib/types'

// Recipe Like Actions

export async function toggleRecipeLikeAction(recipeId: string): Promise<LikeToggleResponse> {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to like recipes')
    }

    const supabase = await createServerSupabaseClient()
    
    // Try to use the database function first
    try {
      const { data, error } = await supabase
        .rpc('toggle_recipe_like', {
          recipe_uuid: recipeId,
          user_uuid: user.id
        })
        .single()

      if (!error && data) {
        // Revalidate recipe pages
        revalidatePath(`/recipes/${recipeId}`)
        revalidatePath('/recipes')
        revalidatePath('/dashboard')

        return {
          liked: data.liked,
          like_count: data.like_count
        }
      }
    } catch (funcError) {
      console.warn('Database function not available, using manual toggle:', funcError)
    }

    // Fallback: manual like toggle
    console.log('Using manual like toggle for recipe:', recipeId)
    
    // Check if user has already liked this recipe
    const { data: existingLike, error: checkError } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing like:', checkError)
      throw new Error('Failed to check like status')
    }

    let liked: boolean
    
    if (existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from('recipe_likes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Error removing like:', deleteError)
        throw new Error('Failed to remove like')
      }
      
      liked = false
    } else {
      // Like - add the like
      const { error: insertError } = await supabase
        .from('recipe_likes')
        .insert({
          recipe_id: recipeId,
          user_id: user.id
        })

      if (insertError) {
        console.error('Error adding like:', insertError)
        throw new Error('Failed to add like')
      }
      
      liked = true
    }

    // Get updated count
    const { count: likeCount, error: countError } = await supabase
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId)

    if (countError) {
      console.error('Error getting like count:', countError)
      throw new Error('Failed to get like count')
    }

    // Revalidate recipe pages
    revalidatePath(`/recipes/${recipeId}`)
    revalidatePath('/recipes')
    revalidatePath('/dashboard')

    return {
      liked,
      like_count: likeCount || 0
    }
  } catch (error) {
    console.error('Error in toggleRecipeLikeAction:', error)
    throw error
  }
}

export async function getRecipeLikeStatus(recipeId: string): Promise<{ isLiked: boolean; likeCount: number }> {
  try {
    const user = await getCurrentUserServer()
    const supabase = await createServerSupabaseClient()

    // Get like count
    const { count: likeCount, error: countError } = await supabase
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId)

    if (countError) {
      throw new Error('Failed to get like count')
    }

    let isLiked = false
    if (user) {
      // Check if current user has liked this recipe
      const { data: userLike, error: userLikeError } = await supabase
        .from('recipe_likes')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)
        .single()

      if (userLikeError && userLikeError.code !== 'PGRST116') {
        throw new Error('Failed to check like status')
      }

      isLiked = !!userLike
    }

    return {
      isLiked,
      likeCount: likeCount || 0
    }
  } catch (error) {
    console.error('Error getting recipe like status:', error)
    return { isLiked: false, likeCount: 0 }
  }
}

// Comment Actions

export async function createCommentAction(recipeId: string, data: CreateCommentData): Promise<RecipeComment> {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to comment')
    }

    const content = data.content.trim()
    if (!content) {
      throw new Error('Comment content is required')
    }

    if (content.length > 1000) {
      throw new Error('Comment must be 1000 characters or less')
    }

    const supabase = await createServerSupabaseClient()

    const { data: comment, error } = await supabase
      .from('recipe_comments')
      .insert({
        recipe_id: recipeId,
        user_id: user.id,
        content: content
      })
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      throw new Error('Failed to create comment')
    }

    // Revalidate recipe pages
    revalidatePath(`/recipes/${recipeId}`)
    revalidatePath('/recipes')

    return comment
  } catch (error) {
    console.error('Error in createCommentAction:', error)
    throw error
  }
}

export async function updateCommentAction(commentId: string, data: UpdateCommentData): Promise<RecipeComment> {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to update comments')
    }

    const content = data.content.trim()
    if (!content) {
      throw new Error('Comment content is required')
    }

    if (content.length > 1000) {
      throw new Error('Comment must be 1000 characters or less')
    }

    const supabase = await createServerSupabaseClient()

    // First verify the comment belongs to the current user
    const { data: existingComment, error: checkError } = await supabase
      .from('recipe_comments')
      .select('user_id, recipe_id')
      .eq('id', commentId)
      .single()

    if (checkError || !existingComment) {
      throw new Error('Comment not found')
    }

    if (existingComment.user_id !== user.id) {
      throw new Error('You can only update your own comments')
    }

    // Update the comment
    const { data: comment, error } = await supabase
      .from('recipe_comments')
      .update({
        content: content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .single()

    if (error) {
      console.error('Error updating comment:', error)
      throw new Error('Failed to update comment')
    }

    // Revalidate recipe pages
    revalidatePath(`/recipes/${existingComment.recipe_id}`)

    return comment
  } catch (error) {
    console.error('Error in updateCommentAction:', error)
    throw error
  }
}

export async function deleteCommentAction(commentId: string): Promise<void> {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to delete comments')
    }

    const supabase = await createServerSupabaseClient()

    // First verify the comment belongs to the current user and get recipe_id
    const { data: existingComment, error: checkError } = await supabase
      .from('recipe_comments')
      .select('user_id, recipe_id')
      .eq('id', commentId)
      .single()

    if (checkError || !existingComment) {
      throw new Error('Comment not found')
    }

    if (existingComment.user_id !== user.id) {
      throw new Error('You can only delete your own comments')
    }

    // Delete the comment
    const { error } = await supabase
      .from('recipe_comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      console.error('Error deleting comment:', error)
      throw new Error('Failed to delete comment')
    }

    // Revalidate recipe pages
    revalidatePath(`/recipes/${existingComment.recipe_id}`)
  } catch (error) {
    console.error('Error in deleteCommentAction:', error)
    throw error
  }
}

export async function getRecipeComments(recipeId: string): Promise<CommentWithStats[]> {
  try {
    const user = await getCurrentUserServer()
    const supabase = await createServerSupabaseClient()

    const { data: comments, error } = await supabase
      .from('recipe_comments')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      throw new Error('Failed to fetch comments')
    }

    // Get like counts and user like status for each comment
    const commentsWithStats: CommentWithStats[] = await Promise.all(
      comments.map(async (comment) => {
        // Get like count
        const { count: likeCount } = await supabase
          .from('comment_likes')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', comment.id)

        // Check if current user has liked this comment
        let userHasLiked = false
        if (user) {
          const { data: userLike } = await supabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', comment.id)
            .eq('user_id', user.id)
            .single()

          userHasLiked = !!userLike
        }

        return {
          ...comment,
          username: comment.profiles?.username || 'Unknown',
          full_name: comment.profiles?.full_name || 'Unknown User',
          like_count: likeCount || 0,
          user_has_liked: userHasLiked
        }
      })
    )

    return commentsWithStats
  } catch (error) {
    console.error('Error in getRecipeComments:', error)
    return []
  }
}

// Comment Like Actions

export async function toggleCommentLikeAction(commentId: string): Promise<LikeToggleResponse> {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to like comments')
    }

    const supabase = await createServerSupabaseClient()
    
    // Use the database function for atomic like toggle
    const { data, error } = await supabase
      .rpc('toggle_comment_like', {
        comment_uuid: commentId,
        user_uuid: user.id
      })
      .single()

    if (error) {
      console.error('Error toggling comment like:', error)
      throw new Error('Failed to toggle like')
    }

    // Get the recipe_id to revalidate the right page
    const { data: comment, error: commentError } = await supabase
      .from('recipe_comments')
      .select('recipe_id')
      .eq('id', commentId)
      .single()

    if (!commentError && comment) {
      revalidatePath(`/recipes/${comment.recipe_id}`)
    }

    return {
      liked: data.liked,
      like_count: data.like_count
    }
  } catch (error) {
    console.error('Error in toggleCommentLikeAction:', error)
    throw error
  }
}
