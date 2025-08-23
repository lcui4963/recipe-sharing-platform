'use client'

import { useState, useTransition } from 'react'
import { MoreHorizontal, Heart, Edit2, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { 
  toggleCommentLikeAction, 
  updateCommentAction, 
  deleteCommentAction 
} from '@/lib/actions/social'
import type { CommentWithStats, UpdateCommentData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CommentItemProps {
  comment: CommentWithStats
  currentUserId?: string
  onCommentUpdated?: () => void
  onCommentDeleted?: () => void
}

export function CommentItem({
  comment,
  currentUserId,
  onCommentUpdated,
  onCommentDeleted
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.user_has_liked || false)
  const [likeCount, setLikeCount] = useState(comment.like_count)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showActions, setShowActions] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isOwner = currentUserId === comment.user_id
  const timeAgo = new Date(comment.created_at).toLocaleDateString()
  const wasEdited = comment.updated_at !== comment.created_at

  const handleToggleLike = () => {
    startTransition(async () => {
      try {
        const result = await toggleCommentLikeAction(comment.id)
        setIsLiked(result.liked)
        setLikeCount(result.like_count)
      } catch (error) {
        console.error('Error toggling comment like:', error)
      }
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
    setShowActions(false)
    setError(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(comment.content)
    setError(null)
  }

  const handleSaveEdit = () => {
    if (!editContent.trim()) {
      setError('Comment content is required')
      return
    }

    if (editContent.length > 1000) {
      setError('Comment must be 1000 characters or less')
      return
    }

    setError(null)

    startTransition(async () => {
      try {
        const updateData: UpdateCommentData = {
          content: editContent.trim()
        }

        await updateCommentAction(comment.id, updateData)
        setIsEditing(false)
        onCommentUpdated?.()
      } catch (error) {
        console.error('Error updating comment:', error)
        setError(error instanceof Error ? error.message : 'Failed to update comment')
      }
    })
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    startTransition(async () => {
      try {
        await deleteCommentAction(comment.id)
        onCommentDeleted?.()
      } catch (error) {
        console.error('Error deleting comment:', error)
        setError(error instanceof Error ? error.message : 'Failed to delete comment')
      }
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {comment.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{comment.full_name}</div>
            <div className="text-sm text-gray-500">
              @{comment.username} • {timeAgo}
              {wasEdited && <span className="ml-1">(edited)</span>}
            </div>
          </div>
        </div>

        {/* Actions menu */}
        {isOwner && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            {showActions && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                  disabled={isPending}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isPending}
              maxLength={1000}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {editContent.length}/1000
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={isPending || !editContent.trim()}
              className="gap-1"
            >
              <Check className="h-3 w-3" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isPending}
              className="gap-1"
            >
              <X className="h-3 w-3" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-gray-900 whitespace-pre-wrap">
          {comment.content}
        </div>
      )}

      {/* Like button */}
      {!isEditing && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleLike}
            disabled={isPending || !currentUserId}
            className={cn(
              'gap-2 text-gray-600 hover:text-red-500',
              isLiked && 'text-red-500'
            )}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-all duration-200',
                isLiked && 'fill-current'
              )}
            />
            <span className="text-sm">{likeCount}</span>
          </Button>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close actions */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  )
}
