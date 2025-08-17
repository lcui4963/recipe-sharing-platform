'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export default function DebugPage() {
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testDatabase = async () => {
    setIsLoading(true)
    setResults([])
    
    try {
      // Test 1: Check Supabase connection
      addResult('Testing Supabase connection...')
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        addResult(`❌ Auth Error: ${authError.message}`)
        return
      }
      addResult('✅ Supabase connection successful')

      // Test 2: Check if user is authenticated
      const user = await getCurrentUser()
      if (user) {
        addResult(`✅ User authenticated: ${user.email}`)
      } else {
        addResult('⚠️ No authenticated user')
      }

      // Test 3: Test profiles table access
      addResult('Testing profiles table access...')
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      if (profilesError) {
        addResult(`❌ Profiles table error: ${profilesError.message}`)
        if (profilesError.code) addResult(`   Code: ${profilesError.code}`)
        if (profilesError.details) addResult(`   Details: ${profilesError.details}`)
        if (profilesError.hint) addResult(`   Hint: ${profilesError.hint}`)
      } else {
        addResult(`✅ Profiles table accessible (${profiles?.length || 0} profiles found)`)
      }

      // Test 4: Test profile update if user exists
      if (user) {
        addResult('Testing profile update...')
        const { data: updateData, error: updateError } = await supabase
          .from('profiles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .select()

        if (updateError) {
          addResult(`❌ Profile update error: ${updateError.message}`)
          if (updateError.code) addResult(`   Code: ${updateError.code}`)
          if (updateError.details) addResult(`   Details: ${updateError.details}`)
          if (updateError.hint) addResult(`   Hint: ${updateError.hint}`)
        } else {
          addResult('✅ Profile update successful')
        }
      }

      // Test 5: Check environment variables
      addResult('Checking environment variables...')
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      
      addResult(`   URL: ${hasUrl ? '✅ Set' : '❌ Missing'}`)
      if (hasUrl && url) {
        addResult(`   URL Preview: ${url.substring(0, 30)}...`)
      }
      addResult(`   Key: ${hasKey ? '✅ Set' : '❌ Missing'}`)
      
      if (!hasUrl || !hasKey) {
        addResult('❌ CRITICAL: Missing environment variables!')
        addResult('   Create/update .env.local file with:')
        addResult('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
        addResult('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
        addResult('   Then restart your dev server: npm run dev')
      }

    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Debug</h1>
        
        <button
          onClick={testDatabase}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {isLoading ? 'Testing...' : 'Run Database Tests'}
        </button>

        {results.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Common Solutions:</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• <strong>Table doesn&apos;t exist:</strong> Run the SQL schema in Supabase SQL Editor</li>
            <li>• <strong>RLS policies:</strong> Check Row Level Security policies in Supabase</li>
            <li>• <strong>Environment variables:</strong> Verify .env.local has correct values</li>
            <li>• <strong>Project status:</strong> Ensure Supabase project is active</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
