import { ProfileSkeleton } from '@/app/components/ui/loading'

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
        
        <ProfileSkeleton />
      </div>
    </div>
  )
}
