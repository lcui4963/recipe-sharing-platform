import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { RecipeGrid, RecipeGridSkeleton } from '@/app/components/recipes'
import { getRecipesByUserServer } from '@/lib/database-server'
import { getCurrentUserServer } from '@/lib/supabase-server-auth'

async function UserRecipesList() {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      redirect('/auth/signin?redirect=/recipes/my-recipes')
    }

    const recipes = await getRecipesByUserServer(user.id)

    return (
      <RecipeGrid 
        recipes={recipes}
        showAuthor={false}
        emptyMessage="You haven't shared any recipes yet. Create your first recipe to get started!"
      />
    )
  } catch (error) {
    console.error('Error loading user recipes:', error)
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load your recipes</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    )
  }
}

export default async function MyRecipesPage() {
  const user = await getCurrentUserServer()
  
  if (!user) {
    redirect('/auth/signin?redirect=/recipes/my-recipes')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
            <p className="text-gray-600 mt-1">Manage and edit your shared recipes</p>
          </div>
          
          <Link href="/recipes/new">
            <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Recipe
            </Button>
          </Link>
        </div>

        {/* Recipes Grid */}
        <Suspense fallback={<RecipeGridSkeleton count={6} />}>
          <UserRecipesList />
        </Suspense>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'My Recipes | Recipe Sharing Platform',
  description: 'Manage and edit your shared recipes'
}
