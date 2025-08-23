import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { RecipeGrid, RecipeGridSkeleton } from '@/app/components/recipes'
import { getRecipesWithStatsServer } from '@/lib/database-server'

interface RecipesPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    difficulty?: string
    page?: string
  }>
}

async function RecipesList({ 
  search, 
  category, 
  difficulty 
}: { 
  search?: string
  category?: string
  difficulty?: string 
}) {
  try {
    // For now, we'll get all recipes and filter client-side
    // Later we can optimize with server-side filtering
    let recipes = await getRecipesWithStatsServer()

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      recipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower) ||
        recipe.ingredients.toLowerCase().includes(searchLower)
      )
    }

    if (category) {
      recipes = recipes.filter(recipe => recipe.category === category)
    }

    if (difficulty) {
      recipes = recipes.filter(recipe => recipe.difficulty === difficulty)
    }

    return (
      <RecipeGrid 
        recipes={recipes}
        emptyMessage={
          search || category || difficulty 
            ? "No recipes match your filters. Try adjusting your search criteria."
            : "No recipes have been shared yet. Be the first to share a recipe!"
        }
      />
    )
  } catch (error) {
    console.error('Error loading recipes:', error)
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load recipes</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    )
  }
}

function RecipeFilters({
  search,
  category,
  difficulty
}: {
  search?: string
  category?: string
  difficulty?: string
}) {
  const categories = [
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
  ]

  const difficulties = ['easy', 'medium', 'hard']

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Recipes</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              name="search"
              type="text"
              placeholder="Search recipes..."
              defaultValue={search}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={difficulty || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams
  const { search, category, difficulty } = params

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover Recipes</h1>
            <p className="text-gray-600 mt-1">Explore delicious recipes shared by our community</p>
          </div>
          
          <Link href="/recipes/new">
            <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Share Recipe
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <form method="GET" action="/recipes">
          <RecipeFilters 
            search={search}
            category={category}
            difficulty={difficulty}
          />
        </form>

        {/* Recipes Grid */}
        <Suspense fallback={<RecipeGridSkeleton count={9} />}>
          <RecipesList 
            search={search}
            category={category}
            difficulty={difficulty}
          />
        </Suspense>
      </div>
    </div>
  )
}
