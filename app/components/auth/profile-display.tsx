'use client'

import { User } from 'lucide-react'
import type { Profile } from '@/lib/types'

interface ProfileDisplayProps {
  profile: Profile
  showBio?: boolean
  compact?: boolean
}

export function ProfileDisplay({ profile, showBio = false, compact = false }: ProfileDisplayProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-orange-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {profile.full_name}
          </span>
          <span className="text-xs text-gray-500">
            @{profile.username}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-orange-600" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">
            {profile.full_name}
          </h3>
          <p className="text-sm text-gray-500">
            @{profile.username}
          </p>
        </div>
      </div>
      
      {showBio && profile.bio && (
        <div className="text-sm text-gray-700 leading-relaxed">
          {profile.bio}
        </div>
      )}
    </div>
  )
}
