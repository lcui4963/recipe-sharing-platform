'use client'

import { useState, useTransition } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { createCommentAction } from '@/lib/actions/social'
import type { CreateCommentData } from '@/lib/types'

interface CommentFormProps {
  recipeId: string
  onCommentAdded?: () => void
  placeholder?: string
}

export function CommentForm({
  recipeId,
  onCommentAdded,
  placeholder = "Add a comment..."
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Comment content is required')
      return
    }

    if (content.length > 1000) {
      setError('Comment must be 1000 characters or less')
      return
    }

    setError(null)

    startTransition(async () => {
      try {
        const commentData: CreateCommentData = {
          content: content.trim()
        }

        await createCommentAction(recipeId, commentData)
        setContent('')
        onCommentAdded?.()
      } catch (error) {
        console.error('Error creating comment:', error)
        setError(error instanceof Error ? error.message : 'Failed to create comment')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          disabled={isPending}
          maxLength={1000}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {content.length}/1000
        </div>
      </div>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !content.trim()}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          {isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  )
}
