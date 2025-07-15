
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { seedTopics } from '@/utils/topicSeeder';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const TopicSeeder = () => {
  const { user } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedTopics = async () => {
    if (!user) {
      toast.error('Please log in to seed topics');
      return;
    }

    setIsSeeding(true);
    try {
      const result = await seedTopics();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Failed to seed topics');
      }
    } catch (error) {
      console.error('Error seeding topics:', error);
      toast.error('Failed to seed topics');
    } finally {
      setIsSeeding(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please log in to manage topics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Database Setup</CardTitle>
        <p className="text-sm text-muted-foreground">
          Initialize the topic taxonomy in the database. This only needs to be done once.
        </p>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleSeedTopics}
          disabled={isSeeding}
          className="w-full"
        >
          {isSeeding ? 'Seeding Topics...' : 'Seed Topics Database'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TopicSeeder;
