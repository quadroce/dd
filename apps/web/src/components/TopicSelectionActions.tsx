
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Save, RotateCcw } from 'lucide-react';

interface TopicSelectionActionsProps {
  selectedCount: number;
  hasChanges: boolean;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

const TopicSelectionActions = ({
  selectedCount,
  hasChanges,
  onSave,
  onReset,
  isSaving
}: TopicSelectionActionsProps) => {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="flex items-center gap-2">
          <Heart className="h-3 w-3 text-red-500" />
          {selectedCount} argomenti selezionati
        </Badge>
        {hasChanges && (
          <Badge variant="secondary" className="text-xs">
            Modifiche non salvate
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        {hasChanges && (
          <Button 
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Annulla
          </Button>
        )}
        <Button 
          onClick={onSave}
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvataggio...' : 'Salva Preferenze'}
        </Button>
      </div>
    </div>
  );
};

export default TopicSelectionActions;
