-- Migration for adding social features: likes and comments
-- Run this after the main schema.sql

-- Create recipe_likes table
CREATE TABLE public.recipe_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT recipe_likes_pkey PRIMARY KEY (id),
  CONSTRAINT recipe_likes_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE,
  CONSTRAINT recipe_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT recipe_likes_unique UNIQUE (recipe_id, user_id)
);

-- Create recipe_comments table
CREATE TABLE public.recipe_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT recipe_comments_pkey PRIMARY KEY (id),
  CONSTRAINT recipe_comments_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE,
  CONSTRAINT recipe_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT recipe_comments_content_check CHECK (length(content) > 0 AND length(content) <= 1000)
);

-- Create comment_likes table (for liking comments)
CREATE TABLE public.comment_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT comment_likes_pkey PRIMARY KEY (id),
  CONSTRAINT comment_likes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.recipe_comments(id) ON DELETE CASCADE,
  CONSTRAINT comment_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT comment_likes_unique UNIQUE (comment_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe_id ON public.recipe_likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_user_id ON public.recipe_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_created_at ON public.recipe_likes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recipe_comments_recipe_id ON public.recipe_comments(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_comments_user_id ON public.recipe_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_comments_created_at ON public.recipe_comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);

-- Create trigger for recipe_comments updated_at
CREATE TRIGGER update_recipe_comments_updated_at 
    BEFORE UPDATE ON public.recipe_comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Recipe likes policies
CREATE POLICY "Users can view all recipe likes" ON public.recipe_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own recipe likes" ON public.recipe_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipe likes" ON public.recipe_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Recipe comments policies
CREATE POLICY "Users can view all recipe comments" ON public.recipe_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own recipe comments" ON public.recipe_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipe comments" ON public.recipe_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipe comments" ON public.recipe_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Users can view all comment likes" ON public.comment_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comment likes" ON public.comment_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment likes" ON public.comment_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Create views for easier querying

-- View for recipe with like and comment counts
CREATE VIEW public.recipes_with_stats AS
SELECT 
    r.*,
    COALESCE(like_counts.like_count, 0) as like_count,
    COALESCE(comment_counts.comment_count, 0) as comment_count
FROM public.recipes r
LEFT JOIN (
    SELECT recipe_id, COUNT(*) as like_count
    FROM public.recipe_likes
    GROUP BY recipe_id
) like_counts ON r.id = like_counts.recipe_id
LEFT JOIN (
    SELECT recipe_id, COUNT(*) as comment_count
    FROM public.recipe_comments
    GROUP BY recipe_id
) comment_counts ON r.id = comment_counts.recipe_id;

-- View for comments with like counts and user info
CREATE VIEW public.comments_with_stats AS
SELECT 
    c.*,
    p.username,
    p.full_name,
    COALESCE(like_counts.like_count, 0) as like_count
FROM public.recipe_comments c
JOIN public.profiles p ON c.user_id = p.id
LEFT JOIN (
    SELECT comment_id, COUNT(*) as like_count
    FROM public.comment_likes
    GROUP BY comment_id
) like_counts ON c.id = like_counts.comment_id;

-- Function to check if user has liked a recipe
CREATE OR REPLACE FUNCTION public.user_has_liked_recipe(recipe_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.recipe_likes 
        WHERE recipe_id = recipe_uuid AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has liked a comment
CREATE OR REPLACE FUNCTION public.user_has_liked_comment(comment_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.comment_likes 
        WHERE comment_id = comment_uuid AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recipe stats (likes, comments) with user interaction status
CREATE OR REPLACE FUNCTION public.get_recipe_stats(recipe_uuid uuid, user_uuid uuid DEFAULT NULL)
RETURNS TABLE (
    recipe_id uuid,
    like_count bigint,
    comment_count bigint,
    user_has_liked boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id as recipe_id,
        COALESCE(like_counts.like_count, 0) as like_count,
        COALESCE(comment_counts.comment_count, 0) as comment_count,
        CASE 
            WHEN user_uuid IS NULL THEN false
            ELSE EXISTS (
                SELECT 1 FROM public.recipe_likes rl 
                WHERE rl.recipe_id = recipe_uuid AND rl.user_id = user_uuid
            )
        END as user_has_liked
    FROM public.recipes r
    LEFT JOIN (
        SELECT recipe_id, COUNT(*) as like_count
        FROM public.recipe_likes
        WHERE recipe_id = recipe_uuid
        GROUP BY recipe_id
    ) like_counts ON r.id = like_counts.recipe_id
    LEFT JOIN (
        SELECT recipe_id, COUNT(*) as comment_count
        FROM public.recipe_comments
        WHERE recipe_id = recipe_uuid
        GROUP BY recipe_id
    ) comment_counts ON r.id = comment_counts.recipe_id
    WHERE r.id = recipe_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle recipe like
CREATE OR REPLACE FUNCTION public.toggle_recipe_like(recipe_uuid uuid, user_uuid uuid)
RETURNS TABLE (
    liked boolean,
    like_count bigint
) AS $$
DECLARE
    is_liked boolean;
    new_count bigint;
BEGIN
    -- Check if already liked
    SELECT EXISTS (
        SELECT 1 FROM public.recipe_likes 
        WHERE recipe_id = recipe_uuid AND user_id = user_uuid
    ) INTO is_liked;
    
    IF is_liked THEN
        -- Unlike
        DELETE FROM public.recipe_likes 
        WHERE recipe_id = recipe_uuid AND user_id = user_uuid;
    ELSE
        -- Like
        INSERT INTO public.recipe_likes (recipe_id, user_id) 
        VALUES (recipe_uuid, user_uuid);
    END IF;
    
    -- Get new count
    SELECT COUNT(*) INTO new_count
    FROM public.recipe_likes 
    WHERE recipe_id = recipe_uuid;
    
    RETURN QUERY SELECT NOT is_liked as liked, new_count as like_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle comment like
CREATE OR REPLACE FUNCTION public.toggle_comment_like(comment_uuid uuid, user_uuid uuid)
RETURNS TABLE (
    liked boolean,
    like_count bigint
) AS $$
DECLARE
    is_liked boolean;
    new_count bigint;
BEGIN
    -- Check if already liked
    SELECT EXISTS (
        SELECT 1 FROM public.comment_likes 
        WHERE comment_id = comment_uuid AND user_id = user_uuid
    ) INTO is_liked;
    
    IF is_liked THEN
        -- Unlike
        DELETE FROM public.comment_likes 
        WHERE comment_id = comment_uuid AND user_id = user_uuid;
    ELSE
        -- Like
        INSERT INTO public.comment_likes (comment_id, user_id) 
        VALUES (comment_uuid, user_uuid);
    END IF;
    
    -- Get new count
    SELECT COUNT(*) INTO new_count
    FROM public.comment_likes 
    WHERE comment_id = comment_uuid;
    
    RETURN QUERY SELECT NOT is_liked as liked, new_count as like_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
