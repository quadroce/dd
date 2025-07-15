
import React from 'react';
import { Search } from 'lucide-react';

const TopicEmptyState = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p>Nessun argomento trovato per i criteri di ricerca.</p>
    </div>
  );
};

export default TopicEmptyState;
