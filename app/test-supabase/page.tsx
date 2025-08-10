import { getRecipes } from '@/lib/database'

export default async function TestSupabasePage() {
  try {
    const recipes = await getRecipes(5)
    
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Supabase connection successful!
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Recipes ({recipes.length})</h2>
          {recipes.length > 0 ? (
            <div className="space-y-4">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm">
                    By: {recipe.user_id} • Created: {new Date(recipe.created_at).toLocaleDateString()}
                  </p>
                  {recipe.description && (
                    <p className="text-gray-700 mt-2">{recipe.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recipes found. Create some recipes to see them here!</p>
          )}
        </div>
        
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p className="font-semibold">Database Schema:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Profiles table: id, username, full_name, created_at, updated_at</li>
            <li>• Recipes table: id, user_id, title, description, ingredients, instructions, cooking_time, difficulty, category, created_at</li>
          </ul>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          ❌ Supabase connection failed!
        </div>
        
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-semibold">Troubleshooting:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Check your environment variables in .env.local</li>
            <li>• Verify your Supabase project URL and API keys</li>
            <li>• Ensure the database schema has been created</li>
            <li>• Check the browser console for detailed error messages</li>
          </ul>
        </div>
        
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </pre>
      </div>
    )
  }
}
