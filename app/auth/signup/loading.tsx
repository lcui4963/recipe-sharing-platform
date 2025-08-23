import { FormSkeleton } from '@/app/components/ui/loading'

export default function SignUpLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community of food lovers
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
          <div className="space-y-6 animate-pulse">
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
            <div className="text-center">
              <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
