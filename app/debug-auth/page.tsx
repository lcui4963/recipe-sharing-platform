'use client'

import { useAuth } from '@/app/components/auth/auth-context'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useState } from 'react'

export default function DebugAuthPage() {
  const { user, profile, signOut, isLoading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<string>('')

  const handleSignOut = async () => {
    setDebugInfo('Starting sign out...')
    try {
      await signOut()
      setDebugInfo('Sign out completed successfully')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setDebugInfo(`Sign out failed: ${errorMsg}`)
      console.error('Debug: Sign out error:', error)
    }
  }

  const clearDebugInfo = () => {
    setDebugInfo('')
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Loading State:</h3>
            <p>{isLoading ? 'Loading...' : 'Not loading'}</p>
          </div>

          <div>
            <h3 className="font-semibold">User State:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {user ? JSON.stringify(
                {
                  id: user.id,
                  email: user.email,
                  created_at: user.created_at,
                  last_sign_in_at: user.last_sign_in_at
                }, 
                null, 
                2
              ) : 'No user'}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">Profile State:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {profile ? JSON.stringify(profile, null, 2) : 'No profile'}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">Debug Info:</h3>
            <pre className="bg-yellow-50 p-2 rounded text-sm min-h-[40px] border">
              {debugInfo || 'No debug info'}
            </pre>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSignOut} 
              disabled={!user || isLoading}
              variant="destructive"
            >
              Test Sign Out
            </Button>
            <Button 
              onClick={clearDebugInfo} 
              variant="outline"
            >
              Clear Debug Info
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>This page helps debug authentication issues.</p>
            <p>Navigate to <code>/debug-auth</code> to access this page.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
