
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Topic {
  id: string;
  slug: string;
  name: string;
  category: string;
  parent_category: string | null;
  description: string | null;
}

interface TopicItemProps {
  topic: Topic;
  isSelected: boolean;
  onToggle: (topicId: string) => void;
}

const TopicItem = ({ topic, isSelected, onToggle }: TopicItemProps) => {
  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected 
          ? 'bg-primary/5 border-primary shadow-sm' 
          : 'hover:bg-gray-50 border-gray-200'
      }`}
      onClick={() => onToggle(topic.id)}
    >
      <Checkbox
        id={topic.id}
        checked={isSelected}
        onCheckedChange={() => onToggle(topic.id)}
      />
      <div className="flex-1">
        <div className="font-medium text-sm leading-tight">{topic.name}</div>
        {topic.description && (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {topic.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicItem;
