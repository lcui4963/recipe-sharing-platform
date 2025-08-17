'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RecipeForm } from '@/app/components/recipes'
import { createRecipeFromData } from '@/lib/actions/recipes'
import type { CreateRecipeData } from '@/lib/types'

export function NewRecipeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (data: CreateRecipeData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const recipe = await createRecipeFromData(data)
      
      // Redirect to the new recipe
      router.push(`/recipes/${recipe.id}`)
    } catch (err) {
      console.error('Error creating recipe:', err)
      setError(err instanceof Error ? err.message : 'Failed to create recipe')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="text-red-800">
              <p className="text-sm font-medium">Error creating recipe</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <RecipeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        mode="create"
      />
    </>
  )
}
