import { redirect } from 'next/navigation'
import { getCurrentUserServer } from '@/lib/supabase-server-auth'
import { ProfilePageContent } from './profile-page-content'

export default async function ProfilePage() {
  // Server-side authentication check
  const user = await getCurrentUserServer()
  
  if (!user) {
    redirect('/auth/signin?redirect=/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile information and account settings
          </p>
        </div>

        <ProfilePageContent />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Profile | Recipe Sharing Platform',
  description: 'Manage your profile information and account settings'
}
