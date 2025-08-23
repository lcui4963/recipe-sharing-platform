import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Search, Calendar } from 'lucide-react'
import { ProtectedRoute } from '@/app/components/auth/protected-route'

import { RecipeCard, RecipeCardSkeleton } from '@/app/components/recipes'
import { DashboardStatsSkeleton } from '@/app/components/ui/loading'
import { getRecipesByUserWithStatsServer, getRecipesWithStatsServer } from '@/lib/database-server'
import { getCurrentUserServer } from '@/lib/supabase-server-auth'

async function DashboardStats() {
  try {
    const user = await getCurrentUserServer()
    if (!user) return null

    const [userRecipes, allRecipes] = await Promise.all([
      getRecipesByUserWithStatsServer(user.id),
      getRecipesWithStatsServer() // Get all recipes
    ])

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Recipes</p>
              <p className="text-2xl font-bold text-gray-900">{userRecipes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Search className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Community Recipes</p>
              <p className="text-2xl font-bold text-gray-900">{allRecipes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {userRecipes.filter(recipe => {
                  const recipeDate = new Date(recipe.created_at)
                  const now = new Date()
                  return recipeDate.getMonth() === now.getMonth() && 
                         recipeDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
    return null
  }
}

async function RecentRecipes() {
  try {
    const user = await getCurrentUserServer()
    if (!user) return null

    const userRecipes = await getRecipesByUserWithStatsServer(user.id)
    const recentRecipes = userRecipes.slice(0, 3)

    if (recentRecipes.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">👨‍🍳</div>
          <p className="text-gray-600 mb-4">No recipes yet!</p>
          <Link
            href="/recipes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Recipe
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {recentRecipes.map((recipe) => (
          <div key={recipe.id} className="transform scale-95">
            <RecipeCard recipe={recipe} showAuthor={false} />
          </div>
        ))}
        
        {userRecipes.length > 3 && (
          <div className="text-center pt-4">
            <Link
              href="/recipes/my-recipes"
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              View all {userRecipes.length} recipes →
            </Link>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading recent recipes:', error)
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Unable to load recent recipes</p>
      </div>
    )
  }
}

export default async function DashboardPage() {
  // Check authentication on the server side
  const user = await getCurrentUserServer()
  
  if (!user) {
    // Let the ProtectedRoute handle the redirect
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Redirecting to sign in...</h2>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome to your recipe sharing dashboard
            </p>
          </div>
          
          {/* Stats */}
          <Suspense fallback={<DashboardStatsSkeleton />}>
            <DashboardStats />
          </Suspense>
          
          <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link
                    href="/recipes/new"
                    className="group p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <Plus className="h-5 w-5 text-orange-600 mr-2" />
                      <div className="font-medium group-hover:text-orange-700">Create Recipe</div>
                    </div>
                    <div className="text-sm text-gray-600">Share your favorite recipe</div>
                  </Link>
                  
                  <Link
                    href="/recipes/my-recipes"
                    className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                      <div className="font-medium group-hover:text-blue-700">My Recipes</div>
                    </div>
                    <div className="text-sm text-gray-600">Manage your recipes</div>
                  </Link>
                  
                  <Link
                    href="/recipes"
                    className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <Search className="h-5 w-5 text-green-600 mr-2" />
                      <div className="font-medium group-hover:text-green-700">Browse Recipes</div>
                    </div>
                    <div className="text-sm text-gray-600">Discover new recipes</div>
                  </Link>
                </div>
              </div>
              
              {/* Recent Recipes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Your Recent Recipes</h2>
                <Suspense fallback={
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="transform scale-95">
                        <RecipeCardSkeleton />
                      </div>
                    ))}
                </div>
                }>
                  <RecentRecipes />
                </Suspense>
              </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
