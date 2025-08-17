'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth/auth-context";
import { Button } from "@/app/components/ui/button";
import { Dropdown } from "@/app/components/ui/dropdown";
import { User, LogOut, Plus, Settings, BookOpen, MoreHorizontal } from "lucide-react";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // The signOut function in auth-context handles the redirect
    } catch (error) {
      console.error('Error signing out:', error);
      // Fall back to manual redirect if signOut fails
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-orange-600">
            RecipeShare
          </Link>
        </div>
        
        <div className="hidden sm:flex items-center space-x-6">
          {/* Public navigation */}
          <Link href="/recipes" className="text-gray-700 hover:text-orange-600 font-medium">
            Recipes
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/recipes/new">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Recipe
                </Button>
              </Link>
              
              <Dropdown
                trigger={<MoreHorizontal className="h-5 w-5 text-gray-600" />}
                items={[
                  {
                    label: "My Recipes",
                    onClick: () => router.push("/recipes/my-recipes"),
                    icon: <BookOpen className="h-4 w-4" />
                  },
                  {
                    label: `Profile (${profile?.full_name || profile?.username || 'User'})`,
                    onClick: () => router.push("/profile"),
                    icon: <Settings className="h-4 w-4" />
                  },
                  {
                    label: "Sign Out",
                    onClick: handleSignOut,
                    icon: <LogOut className="h-4 w-4" />,
                    destructive: true
                  }
                ]}
                align="right"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="sm:hidden">
          {user ? (
            <Dropdown
              trigger={<MoreHorizontal className="h-6 w-6 text-gray-600" />}
              items={[
                {
                  label: "My Recipes",
                  onClick: () => router.push("/recipes/my-recipes"),
                  icon: <BookOpen className="h-4 w-4" />
                },
                {
                  label: "Share Recipe",
                  onClick: () => router.push("/recipes/new"),
                  icon: <Plus className="h-4 w-4" />
                },
                {
                  label: "Dashboard",
                  onClick: () => router.push("/dashboard"),
                  icon: <User className="h-4 w-4" />
                },
                {
                  label: `Profile (${profile?.full_name || profile?.username || 'User'})`,
                  onClick: () => router.push("/profile"),
                  icon: <Settings className="h-4 w-4" />
                },
                {
                  label: "Sign Out",
                  onClick: handleSignOut,
                  icon: <LogOut className="h-4 w-4" />,
                  destructive: true
                }
              ]}
              align="right"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
