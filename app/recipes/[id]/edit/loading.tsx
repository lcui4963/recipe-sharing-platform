import { FormSkeleton } from '@/app/components/ui/loading'

export default function EditRecipeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Recipe</h1>
          <p className="text-gray-600 mt-2">Update your recipe details</p>
        </div>
        
        <FormSkeleton />
      </div>
    </div>
  )
}
