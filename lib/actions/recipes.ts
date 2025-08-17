'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createRecipeServer, updateRecipeServer, deleteRecipeServer } from '@/lib/database-server'
import { getCurrentUserServer } from '@/lib/supabase-server-auth'
import type { CreateRecipeData } from '@/lib/types'

export async function createRecipeAction(formData: FormData) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to create a recipe')
    }

    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const ingredients = formData.get('ingredients') as string
    const instructions = formData.get('instructions') as string
    const cooking_time = formData.get('cooking_time') as string
    const difficulty = formData.get('difficulty') as string
    const category = formData.get('category') as string

    // Validate required fields
    if (!title?.trim()) {
      throw new Error('Recipe title is required')
    }
    if (!ingredients?.trim()) {
      throw new Error('Ingredients are required')
    }
    if (!instructions?.trim()) {
      throw new Error('Instructions are required')
    }

    // Prepare recipe data
    const recipeData: CreateRecipeData = {
      title: title.trim(),
      description: description?.trim() || undefined,
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      cooking_time: cooking_time ? parseInt(cooking_time) : undefined,
      difficulty: difficulty as 'easy' | 'medium' | 'hard' | undefined,
      category: category || undefined
    }

    // Create recipe
    const recipe = await createRecipeServer(user.id, recipeData)
    
    if (!recipe) {
      throw new Error('Failed to create recipe')
    }

    // Revalidate recipes page
    revalidatePath('/recipes')
    revalidatePath('/dashboard')
    
    // Redirect to the new recipe
    redirect(`/recipes/${recipe.id}`)
  } catch (error) {
    console.error('Error creating recipe:', error)
    throw error
  }
}

export async function updateRecipeAction(recipeId: string, formData: FormData) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to update a recipe')
    }

    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const ingredients = formData.get('ingredients') as string
    const instructions = formData.get('instructions') as string
    const cooking_time = formData.get('cooking_time') as string
    const difficulty = formData.get('difficulty') as string
    const category = formData.get('category') as string

    // Validate required fields
    if (!title?.trim()) {
      throw new Error('Recipe title is required')
    }
    if (!ingredients?.trim()) {
      throw new Error('Ingredients are required')
    }
    if (!instructions?.trim()) {
      throw new Error('Instructions are required')
    }

    // Prepare update data
    const updateData: Partial<CreateRecipeData> = {
      title: title.trim(),
      description: description?.trim() || undefined,
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      cooking_time: cooking_time ? parseInt(cooking_time) : undefined,
      difficulty: difficulty as 'easy' | 'medium' | 'hard' | undefined,
      category: category || undefined
    }

    // Update recipe
    const recipe = await updateRecipeServer(recipeId, updateData)
    
    if (!recipe) {
      throw new Error('Failed to update recipe')
    }

    // Revalidate pages
    revalidatePath('/recipes')
    revalidatePath(`/recipes/${recipeId}`)
    revalidatePath('/dashboard')
    
    // Redirect to the updated recipe
    redirect(`/recipes/${recipeId}`)
  } catch (error) {
    console.error('Error updating recipe:', error)
    throw error
  }
}

export async function deleteRecipeAction(recipeId: string) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to delete a recipe')
    }

    // Delete recipe
    const success = await deleteRecipeServer(recipeId)
    
    if (!success) {
      throw new Error('Failed to delete recipe')
    }

    // Revalidate pages
    revalidatePath('/recipes')
    revalidatePath('/dashboard')
    
    // Redirect to recipes page
    redirect('/recipes')
  } catch (error) {
    console.error('Error deleting recipe:', error)
    throw error
  }
}

// Helper function to create recipe from CreateRecipeData object
export async function createRecipeFromData(data: CreateRecipeData) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error('You must be logged in to create a recipe')
    }

    const recipe = await createRecipeServer(user.id, data)
    
    if (!recipe) {
      throw new Error('Failed to create recipe')
    }

    // Revalidate pages
    revalidatePath('/recipes')
    revalidatePath('/dashboard')
    
    return recipe
  } catch (error) {
    console.error('Error creating recipe from data:', error)
    throw error
  }
}
