import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  source: string | null;
  content_type: string;
  published_at: string | null;
  created_at: string;
}

interface UserPreference {
  id: string;
  user_id: string;
  topic_id: string;
  weight: number | null;
  created_at: string;
  topic: {
    id: string;
    name: string;
    category: string;
    description: string | null;
  };
}

export const useUserContent = () => {
  const { user } = useAuth();

  // Fetch user's preferred topics to get relevant content
  const {
    data: userPreferences,
    isLoading: preferencesLoading
  } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select(`
          *,
          topic:topics(*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as UserPreference[];
    },
    enabled: !!user?.id
  });

  // Fetch recent content based on user's topics
  const {
    data: todaysContent,
    isLoading: contentLoading,
    refetch: refetchContent
  } = useQuery({
    queryKey: ['todays-content', user?.id],
    queryFn: async () => {
      if (!user?.id || !userPreferences?.length) return [];
      
      // Get topic IDs from user preferences
      const topicIds = userPreferences.map(pref => pref.topic_id);
      
      const { data, error } = await supabase
        .from('content')
        .select(`
          *,
          content_topics!inner(
            topic_id,
            relevance_score
          )
        `)
        .in('content_topics.topic_id', topicIds)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!user?.id && !!userPreferences?.length
  });

  // For now, we'll simulate saved and liked content since we don't have those tables yet
  // In a real app, you'd have user_saved_content and user_liked_content tables
  const {
    data: savedContent,
    isLoading: savedLoading
  } = useQuery({
    queryKey: ['saved-content', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // This would be a real query to a user_saved_content table
      // For now, returning a subset of content as "saved"
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
        .range(5, 9); // Get items 6-10 as "saved" content
      
      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!user?.id
  });

  const {
    data: likedContent,
    isLoading: likedLoading
  } = useQuery({
    queryKey: ['liked-content', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // This would be a real query to a user_liked_content table
      // For now, returning a subset of content as "liked"
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
        .range(10, 12); // Get items 11-13 as "liked" content
      
      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!user?.id
  });

  const isLoading = preferencesLoading || contentLoading || savedLoading || likedLoading;

  return {
    userPreferences,
    todaysContent: todaysContent || [],
    savedContent: savedContent || [],
    likedContent: likedContent || [],
    isLoading,
    refetchContent
  };
};