
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Topic {
  id: string;
  slug: string;
  name: string;
  category: string;
  parent_category: string | null;
  description: string | null;
}

interface UserPreference {
  id: string;
  user_id: string;
  topic_id: string;
  weight: number;
  topic: Topic;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user preferences
  const {
    data: preferences,
    isLoading,
    error
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

  // Add preference mutation
  const addPreferenceMutation = useMutation({
    mutationFn: async ({ topicId, weight = 1.0 }: { topicId: string; weight?: number }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          weight
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    }
  });

  // Remove preference mutation
  const removePreferenceMutation = useMutation({
    mutationFn: async (topicId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('topic_id', topicId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    }
  });

  // Update preference weight mutation
  const updatePreferenceWeightMutation = useMutation({
    mutationFn: async ({ topicId, weight }: { topicId: string; weight: number }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_preferences')
        .update({ weight })
        .eq('user_id', user.id)
        .eq('topic_id', topicId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    }
  });

  return {
    preferences,
    isLoading,
    error,
    addPreference: addPreferenceMutation.mutate,
    removePreference: removePreferenceMutation.mutate,
    updatePreferenceWeight: updatePreferenceWeightMutation.mutate,
    isAddingPreference: addPreferenceMutation.isPending,
    isRemovingPreference: removePreferenceMutation.isPending,
    isUpdatingWeight: updatePreferenceWeightMutation.isPending
  };
};
