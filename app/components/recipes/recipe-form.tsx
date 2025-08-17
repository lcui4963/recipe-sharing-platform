'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Plus, Minus, Clock, ChefHat } from 'lucide-react'
import type { Recipe, CreateRecipeData } from '@/lib/types'

interface RecipeFormProps {
  recipe?: Recipe
  onSubmit: (data: CreateRecipeData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

const CATEGORIES = [
  'appetizer',
  'main-course',
  'dessert',
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'beverage',
  'salad',
  'soup',
  'vegetarian',
  'vegan',
  'gluten-free'
] as const

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', icon: '🟢' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'hard', label: 'Hard', icon: '🔴' }
] as const

export function RecipeForm({ 
  recipe, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  mode = 'create' 
}: RecipeFormProps) {
  const [formData, setFormData] = useState<CreateRecipeData>({
    title: recipe?.title || '',
    description: recipe?.description || '',
    ingredients: recipe?.ingredients || '',
    instructions: recipe?.instructions || '',
    cooking_time: recipe?.cooking_time || undefined,
    difficulty: recipe?.difficulty || undefined,
    category: recipe?.category || undefined
  })

  const [ingredientsList, setIngredientsList] = useState<string[]>(() => {
    if (recipe?.ingredients) {
      try {
        const parsed = JSON.parse(recipe.ingredients)
        return Array.isArray(parsed) ? parsed : [recipe.ingredients]
      } catch {
        return recipe.ingredients.split('\n').filter(item => item.trim())
      }
    }
    return ['']
  })

  const [instructionsList, setInstructionsList] = useState<string[]>(() => {
    if (recipe?.instructions) {
      try {
        const parsed = JSON.parse(recipe.instructions)
        return Array.isArray(parsed) ? parsed : [recipe.instructions]
      } catch {
        return recipe.instructions.split('\n').filter(item => item.trim())
      }
    }
    return ['']
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const addIngredient = () => {
    setIngredientsList([...ingredientsList, ''])
  }

  const removeIngredient = (index: number) => {
    if (ingredientsList.length > 1) {
      setIngredientsList(ingredientsList.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredientsList]
    updated[index] = value
    setIngredientsList(updated)
  }

  const addInstruction = () => {
    setInstructionsList([...instructionsList, ''])
  }

  const removeInstruction = (index: number) => {
    if (instructionsList.length > 1) {
      setInstructionsList(instructionsList.filter((_, i) => i !== index))
    }
  }

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructionsList]
    updated[index] = value
    setInstructionsList(updated)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Recipe title is required'
    }

    const validIngredients = ingredientsList.filter(ing => ing.trim())
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required'
    }

    const validInstructions = instructionsList.filter(inst => inst.trim())
    if (validInstructions.length === 0) {
      newErrors.instructions = 'At least one instruction step is required'
    }

    if (formData.cooking_time && formData.cooking_time < 0) {
      newErrors.cooking_time = 'Cooking time must be positive'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Prepare data for submission
    const validIngredients = ingredientsList.filter(ing => ing.trim())
    const validInstructions = instructionsList.filter(inst => inst.trim())

    const submitData: CreateRecipeData = {
      ...formData,
      ingredients: JSON.stringify(validIngredients),
      instructions: JSON.stringify(validInstructions),
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined
    }

    try {
      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting recipe:', error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-orange-600" />
          {mode === 'edit' ? 'Edit Recipe' : 'Create New Recipe'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Recipe Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter recipe title..."
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your recipe..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                value={formData.difficulty || ''}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' | undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select difficulty...</option>
                {DIFFICULTIES.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.icon} {diff.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="cooking_time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Cooking Time (minutes)
              </Label>
              <Input
                id="cooking_time"
                type="number"
                min="0"
                value={formData.cooking_time || ''}
                onChange={(e) => setFormData({ ...formData, cooking_time: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="e.g., 30"
                className={errors.cooking_time ? 'border-red-500' : ''}
              />
              {errors.cooking_time && <p className="text-red-500 text-sm mt-1">{errors.cooking_time}</p>}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-lg font-semibold">Ingredients *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Ingredient
              </Button>
            </div>
            <div className="space-y-2">
              {ingredientsList.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}...`}
                    className={errors.ingredients ? 'border-red-500' : ''}
                  />
                  {ingredientsList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      className="flex-shrink-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-lg font-semibold">Instructions *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInstruction}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </div>
            <div className="space-y-3">
              {instructionsList.map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded-full mt-1">
                    {index + 1}
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Step ${index + 1} instructions...`}
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.instructions ? 'border-red-500' : ''}`}
                    rows={2}
                  />
                  {instructionsList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="flex-shrink-0 mt-1"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'edit' ? 'Update Recipe' : 'Create Recipe'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
