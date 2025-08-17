'use client'

import { RecipeCard } from './recipe-card'
import type { Recipe } from '@/lib/types'

interface RecipeGridProps {
  recipes: Recipe[]
  showAuthor?: boolean
  emptyMessage?: string
  className?: string
}

export function RecipeGrid({ 
  recipes, 
  showAuthor = true, 
  emptyMessage = "No recipes found.",
  className = ""
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          showAuthor={showAuthor}
        />
      ))}
    </div>
  )
}
