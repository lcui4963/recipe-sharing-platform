'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageCircle } from 'lucide-react'
import { CommentForm } from './comment-form'
import { CommentItem } from './comment-item'
import { getRecipeComments } from '@/lib/actions/social'
import type { CommentWithStats } from '@/lib/types'

interface CommentsSectionProps {
  recipeId: string
  currentUserId?: string
  initialComments?: CommentWithStats[]
  showTitle?: boolean
}

export function CommentsSection({
  recipeId,
  currentUserId,
  initialComments = [],
  showTitle = true
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentWithStats[]>(initialComments)
  const [isLoading, setIsLoading] = useState(true) // Start with loading true since we'll fetch on mount

  const refreshComments = useCallback(async () => {
    setIsLoading(true)
    try {
      const updatedComments = await getRecipeComments(recipeId)
      setComments(updatedComments)
    } catch (error) {
      console.error('Error refreshing comments:', error)
    } finally {
      setIsLoading(false)
    }
  }, [recipeId])

  // Load comments on component mount
  useEffect(() => {
    refreshComments()
  }, [refreshComments])

  const handleCommentAdded = () => {
    refreshComments()
  }

  const handleCommentUpdated = () => {
    refreshComments()
  }

  const handleCommentDeleted = () => {
    refreshComments()
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
        </div>
      )}

      {/* Comment form - only show if user is logged in */}
      {currentUserId && (
        <div className="bg-gray-50 rounded-lg p-4">
          <CommentForm
            recipeId={recipeId}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet.</p>
            {currentUserId ? (
              <p className="text-sm">Be the first to share your thoughts!</p>
            ) : (
              <p className="text-sm">Sign in to leave a comment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
