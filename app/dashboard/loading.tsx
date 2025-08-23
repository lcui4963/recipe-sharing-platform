import { Plus, BookOpen, Search } from 'lucide-react'
import { DashboardStatsSkeleton, Skeleton } from '@/app/components/ui/loading'
import { RecipeCardSkeleton } from '@/app/components/recipes'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your recipe sharing dashboard
          </p>
        </div>
        
        {/* Stats Skeleton */}
        <DashboardStatsSkeleton />
        
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="group p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <Plus className="h-5 w-5 text-orange-600 mr-2" />
                    <div className="font-medium group-hover:text-orange-700">Create Recipe</div>
                  </div>
                  <div className="text-sm text-gray-600">Share your favorite recipe</div>
                </div>
                
                <div className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <div className="font-medium group-hover:text-blue-700">My Recipes</div>
                  </div>
                  <div className="text-sm text-gray-600">Manage your recipes</div>
                </div>
                
                <div className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <Search className="h-5 w-5 text-green-600 mr-2" />
                    <div className="font-medium group-hover:text-green-700">Browse Recipes</div>
                  </div>
                  <div className="text-sm text-gray-600">Discover new recipes</div>
                </div>
              </div>
            </div>
            
            {/* Recent Recipes Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Your Recent Recipes</h2>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="transform scale-95">
                    <RecipeCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
