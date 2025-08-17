'use client'

import Link from "next/link";
import { Search, Plus, ArrowRight } from "lucide-react";
import { useAuth } from "@/app/components/auth/auth-context";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              {user ? (
                <>
                  Share Your <span className="text-orange-600">Culinary</span>
                  <span className="block text-orange-600">Masterpieces</span>
                </>
              ) : (
                <>
                  Discover & Share
                  <span className="block text-orange-600">Delicious Recipes</span>
                </>
              )}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {user 
                ? "Ready to create something amazing? Share your favorite recipes with our community."
                : "Join our community of food lovers. Find inspiration, share your favorite recipes, and explore culinary delights from around the world."
              }
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full px-4 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link href="/recipes/new">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Plus className="h-5 w-5 mr-2" />
                      Share Your Recipe
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
