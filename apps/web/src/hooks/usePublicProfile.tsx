import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PublicProfileData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

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

export const usePublicProfile = (username: string) => {
  // Fetch public profile data
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      if (!username) return null;
      
      // In a real app, you'd have a username field or slug
      // For now, we'll try to match by email prefix
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .like('email', `${username}%`)
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data as PublicProfileData | null;
    },
    enabled: !!username
  });

  // Fetch public content - in a real app, this would be content the user has made public
  const {
    data: publicContent,
    isLoading: contentLoading
  } = useQuery({
    queryKey: ['public-content', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      // For now, we'll show recent content from the database
      // In a real app, you'd have user-specific public content
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!profile?.id
  });

  const isLoading = profileLoading || contentLoading;
  const isPublic = true; // In a real app, this would be a user setting

  return {
    profile,
    publicContent: publicContent || [],
    isLoading,
    isPublic,
    error: profileError
  };
};