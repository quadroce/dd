
import React from 'react';
import { Badge } from '@/components/ui/badge';
import TopicItem from './TopicItem';

interface Topic {
  id: string;
  slug: string;
  name: string;
  category: string;
  parent_category: string | null;
  description: string | null;
}

interface TopicCategorySectionProps {
  category: string;
  topics: Topic[];
  selectedTopics: Set<string>;
  onTopicToggle: (topicId: string) => void;
}

const TopicCategorySection = ({
  category,
  topics,
  selectedTopics,
  onTopicToggle
}: TopicCategorySectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
        {category.replace('_', ' ')}
        <Badge variant="secondary" className="text-xs">
          {topics.length}
        </Badge>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((topic) => (
          <TopicItem
            key={topic.id}
            topic={topic}
            isSelected={selectedTopics.has(topic.id)}
            onToggle={onTopicToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicCategorySection;
