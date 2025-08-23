import { Plus } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { RecipeGridSkeleton } from '@/app/components/recipes'

export default function MyRecipesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
            <p className="text-gray-600 mt-1">Manage and share your delicious creations</p>
          </div>
          
          <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Recipe
          </Button>
        </div>

        {/* Loading Grid */}
        <RecipeGridSkeleton count={6} />
      </div>
    </div>
  )
}
