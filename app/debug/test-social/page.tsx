'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { toggleRecipeLikeAction, getRecipeLikeStatus } from '@/lib/actions/social'

export default function TestSocialPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testLikeToggle = async () => {
    setIsLoading(true)
    addResult('Testing like toggle...')
    
    try {
      // Use a test recipe ID - replace with an actual recipe ID from your database
      const testRecipeId = '00000000-0000-0000-0000-000000000000' // This will fail but show us the error
      
      const result = await toggleRecipeLikeAction(testRecipeId)
      addResult(`Like toggle success: ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Like toggle error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setIsLoading(false)
  }

  const testLikeStatus = async () => {
    setIsLoading(true)
    addResult('Testing like status...')
    
    try {
      const testRecipeId = '00000000-0000-0000-0000-000000000000'
      const result = await getRecipeLikeStatus(testRecipeId)
      addResult(`Like status success: ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Like status error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setIsLoading(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Social Features Debug</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={testLikeToggle} disabled={isLoading}>
          Test Like Toggle
        </Button>
        
        <Button onClick={testLikeStatus} disabled={isLoading}>
          Test Like Status
        </Button>
        
        <Button onClick={clearResults} variant="outline">
          Clear Results
        </Button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Test Results:</h2>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No test results yet. Click a test button to start.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you have the social tables created in your Supabase database</li>
          <li>Make sure the <code>toggle_recipe_like</code> function exists in your database</li>
          <li>Replace the test recipe ID with a real recipe ID from your database</li>
          <li>Check the browser console for additional error details</li>
        </ol>
      </div>
    </div>
  )
}
