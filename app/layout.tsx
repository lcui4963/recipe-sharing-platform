import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Sharing Platform",
  description: "Discover and share your favorite recipes with food lovers around the world",
};

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-orange-600">
            RecipeShare
          </Link>
        </div>
        <div className="hidden sm:flex items-center space-x-8">
          <Link href="/recipes" className="text-gray-600 hover:text-gray-900">
            Browse Recipes
          </Link>
          <Link href="/categories" className="text-gray-600 hover:text-gray-900">
            Categories
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link href="/signup" className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
              Sign up
            </Link>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
              Share Recipe
            </button>
          </div>
        </div>
        <div className="sm:hidden">
          <button 
            aria-label="Open menu"
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Mobile menu panel will be implemented with state management */}
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
