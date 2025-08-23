import { Plus, Search } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Skeleton } from '@/app/components/ui/loading'
import { RecipeGridSkeleton } from '@/app/components/recipes'

export default function RecipesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover Recipes</h1>
            <p className="text-gray-600 mt-1">Explore delicious recipes shared by our community</p>
          </div>
          
          <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Share Recipe
          </Button>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 animate-pulse">
          <Skeleton className="h-6 w-32 mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Skeleton className="h-10 w-full pl-10" />
              </div>
            </div>

            {/* Category */}
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Difficulty */}
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Recipes Grid Skeleton */}
        <RecipeGridSkeleton count={9} />
      </div>
    </div>
  )
}
