'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RecipeDetail } from '@/app/components/recipes'
import { deleteRecipeAction } from '@/lib/actions/recipes'
import type { Recipe } from '@/lib/types'

interface RecipeDetailViewProps {
  recipe: Recipe
  currentUserId?: string
}

export function RecipeDetailView({ recipe, currentUserId }: RecipeDetailViewProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/recipes/${recipe.id}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    
    try {
      await deleteRecipeAction(recipe.id)
      // Redirect will happen automatically from the server action
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Failed to delete recipe. Please try again.')
      setIsDeleting(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <RecipeDetail
      recipe={recipe}
      currentUserId={currentUserId}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
      isLoading={isDeleting}
    />
  )
}
