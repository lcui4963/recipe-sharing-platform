'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { toggleRecipeLikeAction } from '@/lib/actions/social'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  recipeId: string
  initialLiked: boolean
  initialCount: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string
}

export function LikeButton({
  recipeId,
  initialLiked,
  initialCount,
  size = 'md',
  showCount = true,
  className
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  const handleToggleLike = () => {
    console.log('Like button clicked for recipe:', recipeId)
    startTransition(async () => {
      try {
        console.log('Calling toggleRecipeLikeAction...')
        const result = await toggleRecipeLikeAction(recipeId)
        console.log('Toggle result:', result)
        setIsLiked(result.liked)
        setLikeCount(result.like_count)
      } catch (error) {
        console.error('Error toggling like:', error)
        // Revert optimistic update on error
        setIsLiked(initialLiked)
        setLikeCount(initialCount)
      }
    })
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const buttonSizes = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-9 px-3',
    lg: 'h-10 px-4'
  }

  return (
    <Button
      variant={isLiked ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggleLike}
      disabled={isPending}
      className={cn(
        'gap-2 transition-all duration-200',
        buttonSizes[size],
        isLiked && 'bg-red-500 hover:bg-red-600 text-white border-red-500',
        className
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isLiked && 'fill-current'
        )}
      />
      {showCount && (
        <span className="font-medium">
          {likeCount}
        </span>
      )}
    </Button>
  )
}
