
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import TopicSelector from '@/components/TopicSelector';
import TopicSeeder from '@/components/TopicSeeder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Heart } from 'lucide-react';

const Preferences = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Accesso Richiesto</h2>
            <p className="text-muted-foreground mb-6">
              Effettua il login per gestire i tuoi interessi e personalizzare la tua esperienza.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Vai al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Indietro
              </Button>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold">I Miei Interessi</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Heart className="h-5 w-5 text-red-500" />
                Personalizza la Tua Esperienza
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 leading-relaxed">
                Seleziona gli argomenti che ti interessano di più per ricevere contenuti personalizzati. 
                Puoi modificare le tue preferenze in qualsiasi momento.
              </p>
            </CardContent>
          </Card>
          
          {/* Topic Seeder - Only shown for development/admin purposes */}
          <div className="mb-6">
            <TopicSeeder />
          </div>

          {/* Main Topic Selection */}
          <TopicSelector />
        </div>
      </div>
    </div>
  );
};

export default Preferences;
