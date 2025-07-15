
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import TopicSearchFilters from './TopicSearchFilters';
import TopicCategorySection from './TopicCategorySection';
import TopicSelectionActions from './TopicSelectionActions';
import TopicEmptyState from './TopicEmptyState';

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

const TopicSelector = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch all topics
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as Topic[];
    }
  });

  // Fetch user preferences
  const { data: userPreferences, isLoading: preferencesLoading } = useQuery({
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

  // Update selected topics when user preferences load
  useEffect(() => {
    if (userPreferences) {
      const preferredTopicIds = new Set(userPreferences.map(pref => pref.topic_id));
      setSelectedTopics(preferredTopicIds);
      setHasChanges(false);
    }
  }, [userPreferences]);

  // Mutation to update user preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (topicIds: string[]) => {
      if (!user?.id) throw new Error('Utente non autenticato');

      // First, delete all existing preferences for this user
      const { error: deleteError } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Then insert new preferences
      if (topicIds.length > 0) {
        const preferences = topicIds.map(topicId => ({
          user_id: user.id,
          topic_id: topicId,
          weight: 1.0
        }));

        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert(preferences);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast.success('Preferenze aggiornate con successo!');
      setHasChanges(false);
    },
    onError: (error) => {
      console.error('Errore nell\'aggiornamento delle preferenze:', error);
      toast.error('Errore nell\'aggiornamento delle preferenze');
    }
  });

  const handleTopicToggle = (topicId: string) => {
    const newSelected = new Set(selectedTopics);
    if (newSelected.has(topicId)) {
      newSelected.delete(topicId);
    } else {
      newSelected.add(topicId);
    }
    setSelectedTopics(newSelected);
    setHasChanges(true);
  };

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate(Array.from(selectedTopics));
  };

  const handleResetPreferences = () => {
    if (userPreferences) {
      const preferredTopicIds = new Set(userPreferences.map(pref => pref.topic_id));
      setSelectedTopics(preferredTopicIds);
      setHasChanges(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Effettua il login per gestire i tuoi interessi.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (topicsLoading || preferencesLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Caricamento argomenti...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group topics by category and filter
  const topicsByCategory = topics?.reduce((acc, topic) => {
    // Apply search filter
    if (searchTerm && !topic.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !topic.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return acc;
    }
    
    // Apply category filter
    if (selectedCategory !== 'all' && topic.category !== selectedCategory) {
      return acc;
    }

    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {} as Record<string, Topic[]>) || {};

  const categories = topics?.reduce((acc, topic) => {
    if (!acc.includes(topic.category)) {
      acc.push(topic.category);
    }
    return acc;
  }, [] as string[]) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            I Tuoi Interessi
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Seleziona gli argomenti che ti interessano per personalizzare il tuo feed di contenuti.
          </p>
        </CardHeader>
        <CardContent>
          <TopicSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />

          <div className="space-y-6">
            {Object.entries(topicsByCategory).map(([category, categoryTopics]) => (
              <TopicCategorySection
                key={category}
                category={category}
                topics={categoryTopics}
                selectedTopics={selectedTopics}
                onTopicToggle={handleTopicToggle}
              />
            ))}
          </div>

          {Object.keys(topicsByCategory).length === 0 && <TopicEmptyState />}
          
          <TopicSelectionActions
            selectedCount={selectedTopics.size}
            hasChanges={hasChanges}
            onSave={handleSavePreferences}
            onReset={handleResetPreferences}
            isSaving={updatePreferencesMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicSelector;
