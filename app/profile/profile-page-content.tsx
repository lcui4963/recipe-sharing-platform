'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useAuth } from '@/app/components/auth/auth-context'
import { UserProfile } from '@/app/components/auth/user-profile'
import { ProfileDisplay } from '@/app/components/auth/profile-display'
import { RecipeCard } from '@/app/components/recipes/recipe-card'
import { getRecipesByUser } from '@/lib/database'
import type { Recipe } from '@/lib/types'
import { useEffect } from 'react'

export function ProfilePageContent() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([])
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview')

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user) return
      
      try {
        setIsLoadingRecipes(true)
        const recipes = await getRecipesByUser(user.id)
        setUserRecipes(recipes)
      } catch (error) {
        console.error('Error fetching user recipes:', error)
      } finally {
        setIsLoadingRecipes(false)
      }
    }

    fetchUserRecipes()
  }, [user])

  if (!user || !profile) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading profile...</h3>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  const recentRecipes = userRecipes.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'edit'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Edit Profile
          </button>
        </nav>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileDisplay profile={profile} showBio={true} />
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(profile.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen className="h-4 w-4" />
                    <span>{userRecipes.length} recipe{userRecipes.length !== 1 ? 's' : ''} shared</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href="/recipes/my-recipes">
                    <Button variant="outline" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View All My Recipes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Recipes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Recipes</CardTitle>
                  {userRecipes.length > 3 && (
                    <Link href="/recipes/my-recipes">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingRecipes ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : recentRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentRecipes.map((recipe) => (
                      <div key={recipe.id} className="transform scale-95">
                        <RecipeCard recipe={recipe} showAuthor={false} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">👨‍🍳</div>
                    <p className="text-gray-600 mb-4">No recipes yet!</p>
                    <Link href="/recipes/new">
                      <Button>
                        Share Your First Recipe
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <UserProfile />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
