import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { getRecipeByIdServer } from '@/lib/database-server'
import { getCurrentUserServer } from '@/lib/supabase-server-auth'
import { EditRecipeForm } from './edit-recipe-form'
import { Loading } from '@/app/components/ui/loading'

interface EditRecipePageProps {
  params: Promise<{
    id: string
  }>
}

async function EditRecipeContent({ recipeId }: { recipeId: string }) {
  try {
    const [recipe, currentUser] = await Promise.all([
      getRecipeByIdServer(recipeId),
      getCurrentUserServer()
    ])

    if (!recipe) {
      notFound()
    }

    if (!currentUser) {
      redirect('/auth/signin?redirect=/recipes/' + recipeId + '/edit')
    }

    // Check if user owns this recipe
    if (recipe.user_id !== currentUser.id) {
      redirect('/recipes/' + recipeId)
    }

    return <EditRecipeForm recipe={recipe} />
  } catch (error) {
    console.error('Error loading recipe for edit:', error)
    notFound()
  }
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Recipe</h1>
          <p className="text-gray-600 mt-2">
            Update your recipe details and share improvements with the community.
          </p>
        </div>

        <Suspense fallback={<Loading />}>
          <EditRecipeContent recipeId={id} />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: EditRecipePageProps) {
  const { id } = await params
  
  try {
    const recipe = await getRecipeByIdServer(id)
    
    if (!recipe) {
      return {
        title: 'Recipe Not Found',
        description: 'The requested recipe could not be found.'
      }
    }

    return {
      title: `Edit ${recipe.title} | Recipe Sharing Platform`,
      description: `Edit your recipe: ${recipe.title}`
    }
  } catch {
    return {
      title: 'Edit Recipe',
      description: 'Edit your recipe details.'
    }
  }
}
