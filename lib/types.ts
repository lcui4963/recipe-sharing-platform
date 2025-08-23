export interface Profile {
  id: string
  username: string
  full_name: string
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  created_at: string
  user_id: string
  title: string
  description: string | null
  ingredients: string
  instructions: string
  cooking_time: number | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  category: string | null
  profiles?: {
    username: string
    full_name: string
  } | null
}

export interface CreateRecipeData {
  title: string
  description?: string
  ingredients: string
  instructions: string
  cooking_time?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  category?: string
}

export interface UpdateProfileData {
  username?: string
  full_name?: string
  bio?: string
}

// Social Features Types

export interface RecipeLike {
  id: string
  recipe_id: string
  user_id: string
  created_at: string
}

export interface RecipeComment {
  id: string
  recipe_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  profiles?: {
    username: string
    full_name: string
  } | null
  like_count?: number
  user_has_liked?: boolean
}

export interface CommentLike {
  id: string
  comment_id: string
  user_id: string
  created_at: string
}

// Extended Recipe type with social stats
export interface RecipeWithStats extends Recipe {
  like_count: number
  comment_count: number
  user_has_liked?: boolean
}

// Comment with user info and stats
export interface CommentWithStats extends RecipeComment {
  username: string
  full_name: string
  like_count: number
  user_has_liked?: boolean
}

// API Response types
export interface LikeToggleResponse {
  liked: boolean
  like_count: number
}

export interface RecipeStatsResponse {
  recipe_id: string
  like_count: number
  comment_count: number
  user_has_liked: boolean
}

// Form data types
export interface CreateCommentData {
  content: string
}

export interface UpdateCommentData {
  content: string
}
