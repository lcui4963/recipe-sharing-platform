import Image from "next/image";
import { Search } from "lucide-react";

const DUMMY_RECIPES = [
  {
    id: 1,
    title: "Classic Spaghetti Carbonara",
    category: "Main Course",
    time: "30 mins",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    title: "Chocolate Chip Cookies",
    category: "Dessert",
    time: "45 mins",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    title: "Greek Salad",
    category: "Appetizer",
    time: "15 mins",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  // Add more dummy recipes as needed
];

function RecipeCard({ recipe }: { recipe: typeof DUMMY_RECIPES[0] }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{recipe.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{recipe.category}</span>
          <span>{recipe.time}</span>
        </div>
        <div className="mt-2">
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Discover & Share
              <span className="block text-orange-600">Delicious Recipes</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join our community of food lovers. Find inspiration, share your favorite recipes, and explore culinary delights from around the world.
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
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_RECIPES.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}
