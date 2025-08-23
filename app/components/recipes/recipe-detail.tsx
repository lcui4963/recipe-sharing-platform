'use client'

import { useState } from 'react'
import { Clock, ChefHat, User, Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { RecipeStats, CommentsSection } from '@/app/components/social'
import { getRecipeComments } from '@/lib/actions/social'
import type { RecipeWithStats, CommentWithStats } from '@/lib/types'

interface RecipeDetailProps {
  recipe: RecipeWithStats
  currentUserId?: string
  onEdit?: () => void
  onDelete?: () => void
  onBack?: () => void
  isLoading?: boolean
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
} as const

const DIFFICULTY_ICONS = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴'
} as const

export function RecipeDetail({ 
  recipe, 
  currentUserId, 
  onEdit, 
  onDelete, 
  onBack, 
  isLoading = false 
}: RecipeDetailProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const isOwner = currentUserId === recipe.user_id
  
  const formatCookingTime = (minutes: number | null) => {
    if (!minutes) return 'Not specified'
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes` : `${hours} hour${hours > 1 ? 's' : ''}`
  }

  const formatCategory = (category: string | null) => {
    if (!category) return 'Uncategorized'
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Parse ingredients and instructions
  const parseIngredients = () => {
    try {
      const parsed = JSON.parse(recipe.ingredients)
      return Array.isArray(parsed) ? parsed.filter(ing => ing.trim()) : [recipe.ingredients]
    } catch {
      return recipe.ingredients.split('\n').filter(ing => ing.trim())
    }
  }

  const parseInstructions = () => {
    try {
      const parsed = JSON.parse(recipe.instructions)
      return Array.isArray(parsed) ? parsed.filter(inst => inst.trim()) : [recipe.instructions]
    } catch {
      return recipe.instructions.split('\n').filter(inst => inst.trim())
    }
  }

  const ingredients = parseIngredients()
  const instructions = parseInstructions()

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)
  }

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedSteps(newCompleted)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        
        {isOwner && (
          <div className="flex items-center gap-2 ml-auto">
            {onEdit && (
              <Button
                variant="outline"
                onClick={onEdit}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                onClick={onDelete}
                disabled={isLoading}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Recipe Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                {recipe.title}
              </CardTitle>
              
              {recipe.description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {recipe.description}
                </p>
              )}
            </div>

            {recipe.difficulty && (
              <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
                {DIFFICULTY_ICONS[recipe.difficulty]} {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </div>
            )}
          </div>

          {/* Recipe Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatCookingTime(recipe.cooking_time)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              <span>{ingredients.length} ingredients</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-orange-400 rounded-full"></span>
              <span>{formatCategory(recipe.category)}</span>
            </div>

            {recipe.profiles && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>by {recipe.profiles.full_name || recipe.profiles.username}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(recipe.created_at)}</span>
            </div>
          </div>
        </CardHeader>
        
        {/* Social Stats */}
        <CardContent className="pt-0">
          <RecipeStats
            recipe={recipe}
            currentUserId={currentUserId}
            showLikeButton={true}
            className="pt-4 border-t border-gray-100"
          />
        </CardContent>
      </Card>

      {/* Single Page Layout - All Recipe Information */}
      <div className="space-y-6">
        {/* Ingredients Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <ChefHat className="h-6 w-6 text-orange-600" />
              Ingredients
              <span className="text-sm font-normal text-gray-500">({ingredients.length} items)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => toggleIngredient(index)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 transition-colors ${
                      checkedIngredients.has(index)
                        ? 'bg-orange-600 border-orange-600'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {checkedIngredients.has(index) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-gray-700 font-medium ${checkedIngredients.has(index) ? 'line-through text-gray-400' : ''}`}>
                    {ingredient}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions & Steps Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <span className="text-orange-600">📝</span>
              Instructions & Steps
              <span className="text-sm font-normal text-gray-500">({instructions.length} steps)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => toggleStep(index)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-colors ${
                      completedSteps.has(index)
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : 'border-orange-300 text-orange-600 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                  <div className={`flex-1 pt-1 ${completedSteps.has(index) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    <h4 className="font-semibold text-gray-900 mb-2">Step {index + 1}</h4>
                    <p className="leading-relaxed text-lg">{instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardContent className="p-6">
            <CommentsSection
              recipeId={recipe.id}
              currentUserId={currentUserId}
              showTitle={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
