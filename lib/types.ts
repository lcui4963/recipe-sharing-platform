export interface Profile {
  id: string
  username: string
  full_name: string
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
}
