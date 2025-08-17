'use client'

import Link from 'next/link'
import { Clock, ChefHat, User, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import type { Recipe } from '@/lib/types'

interface RecipeCardProps {
  recipe: Recipe
  showAuthor?: boolean
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
} as const

const DIFFICULTY_ICONS = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴'
} as const

export function RecipeCard({ recipe, showAuthor = true }: RecipeCardProps) {
  const formatCookingTime = (minutes: number | null) => {
    if (!minutes) return null
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatCategory = (category: string | null) => {
    if (!category) return null
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Parse ingredients to show count
  const getIngredientCount = () => {
    try {
      const parsed = JSON.parse(recipe.ingredients)
      if (Array.isArray(parsed)) {
        return parsed.filter(ing => ing.trim()).length
      }
    } catch {
      // Fallback for plain text ingredients
      return recipe.ingredients.split('\n').filter(ing => ing.trim()).length
    }
    return 0
  }

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
              {recipe.title}
            </h3>
            {recipe.difficulty && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
                {DIFFICULTY_ICONS[recipe.difficulty]} {recipe.difficulty}
              </span>
            )}
          </div>
          
          {recipe.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {recipe.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Recipe Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {recipe.cooking_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatCookingTime(recipe.cooking_time)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                <span>{getIngredientCount()} ingredients</span>
              </div>

              {recipe.category && (
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span>{formatCategory(recipe.category)}</span>
                </div>
              )}
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              {showAuthor && recipe.profiles && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>by {recipe.profiles.full_name || recipe.profiles.username}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(recipe.created_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
