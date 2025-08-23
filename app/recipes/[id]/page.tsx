import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getRecipeWithStatsServer } from '@/lib/database-server'
import { getCurrentUserServer } from '@/lib/supabase-server-auth'
import { RecipeDetailView } from './recipe-detail-view'
import { RecipeDetailSkeleton } from '@/app/components/recipes'

interface RecipePageProps {
  params: Promise<{
    id: string
  }>
}

async function RecipeContent({ recipeId }: { recipeId: string }) {
  try {
    const [recipe, currentUser] = await Promise.all([
      getRecipeWithStatsServer(recipeId),
      getCurrentUserServer()
    ])

    if (!recipe) {
      notFound()
    }

    return (
      <RecipeDetailView 
        recipe={recipe}
        currentUserId={currentUser?.id}
      />
    )
  } catch (error) {
    console.error('Error loading recipe:', error)
    notFound()
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<RecipeDetailSkeleton />}>
          <RecipeContent recipeId={id} />
        </Suspense>
      </div>
    </div>
  )
}

// Generate metadata for the recipe page
export async function generateMetadata({ params }: RecipePageProps) {
  const { id } = await params
  
  try {
    const recipe = await getRecipeWithStatsServer(id)
    
    if (!recipe) {
      return {
        title: 'Recipe Not Found',
        description: 'The requested recipe could not be found.'
      }
    }

    return {
      title: `${recipe.title} | Recipe Sharing Platform`,
      description: recipe.description || `Delicious ${recipe.title} recipe shared by ${recipe.profiles?.full_name || 'a community member'}`
    }
  } catch {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.'
    }
  }
}
