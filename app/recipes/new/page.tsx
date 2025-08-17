import { redirect } from 'next/navigation'
import { getCurrentUserServer } from '@/lib/supabase-server-auth'
import { NewRecipeForm } from './new-recipe-form'

export default async function NewRecipePage() {
  // Server-side authentication check
  const user = await getCurrentUserServer()
  
  if (!user) {
    redirect('/auth/signin?redirect=/recipes/new')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Share a New Recipe</h1>
          <p className="text-gray-600 mt-2">
            Share your favorite recipe with the community and help others discover something delicious!
          </p>
        </div>

        <NewRecipeForm />
      </div>
    </div>
  )
}
