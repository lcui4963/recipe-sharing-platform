'use client'

import { Heart, MessageCircle, Eye } from 'lucide-react'
import { LikeButton } from './like-button'
import type { RecipeWithStats } from '@/lib/types'

interface RecipeStatsProps {
  recipe: RecipeWithStats
  currentUserId?: string
  showLikeButton?: boolean
  variant?: 'compact' | 'full'
  className?: string
}

export function RecipeStats({
  recipe,
  currentUserId,
  showLikeButton = true,
  variant = 'full',
  className = ''
}: RecipeStatsProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 text-sm text-gray-600 ${className}`}>
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{recipe.like_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{recipe.comment_count}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-6">
        {/* Like count display */}
        <div className="flex items-center gap-2 text-gray-600">
          <Heart className="h-5 w-5" />
          <span className="font-medium">{recipe.like_count} likes</span>
        </div>

        {/* Comment count display */}
        <div className="flex items-center gap-2 text-gray-600">
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">{recipe.comment_count} comments</span>
        </div>
      </div>

      {/* Like button - only show if user is logged in */}
      {showLikeButton && currentUserId && (
        <LikeButton
          recipeId={recipe.id}
          initialLiked={recipe.user_has_liked || false}
          initialCount={recipe.like_count}
          size="md"
          showCount={false}
        />
      )}
    </div>
  )
}
