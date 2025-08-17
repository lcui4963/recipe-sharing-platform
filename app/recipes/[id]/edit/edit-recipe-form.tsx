'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { RecipeForm } from '@/app/components/recipes'
import { updateRecipeAction } from '@/lib/actions/recipes'
import type { Recipe, CreateRecipeData } from '@/lib/types'

interface EditRecipeFormProps {
  recipe: Recipe
}

export function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()

  const handleSubmit = async (data: CreateRecipeData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      if (data.description) formData.append('description', data.description)
      formData.append('ingredients', data.ingredients)
      formData.append('instructions', data.instructions)
      if (data.cooking_time) formData.append('cooking_time', data.cooking_time.toString())
      if (data.difficulty) formData.append('difficulty', data.difficulty)
      if (data.category) formData.append('category', data.category)

      await updateRecipeAction(params.id as string, formData)
      // Redirect will happen automatically from the server action
    } catch (err) {
      console.error('Error updating recipe:', err)
      setError(err instanceof Error ? err.message : 'Failed to update recipe')
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/recipes/${recipe.id}`)
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="text-red-800">
              <p className="text-sm font-medium">Error updating recipe</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <RecipeForm
        recipe={recipe}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        mode="edit"
      />
    </>
  )
}
