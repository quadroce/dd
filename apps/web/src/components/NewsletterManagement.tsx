import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Zap, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const NewsletterManagement = () => {
  const { user } = useAuth();
  const [isCollecting, setIsCollecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  const handleCollectContent = async () => {
    if (!user) return;
    
    setIsCollecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('collect-content');
      
      if (error) {
        console.error('Collect content error:', error);
        throw error;
      }
      
      console.log('Collect content response:', data);
      toast.success('Raccolta contenuti completata con successo!');
    } catch (error) {
      console.error('Errore nella raccolta contenuti:', error);
      toast.error(`Errore durante la raccolta contenuti: ${error.message}`);
    } finally {
      setIsCollecting(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!user) return;
    
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter');
      
      if (error) {
        console.error('Send newsletter error:', error);
        throw error;
      }
      
      console.log('Send newsletter response:', data);
      toast.success('Newsletter inviata con successo!');
    } catch (error) {
      console.error('Errore nell\'invio newsletter:', error);
      toast.error(`Errore durante l'invio della newsletter: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleTestNewsletter = async () => {
    if (!user) return;
    
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-newsletter');
      
      if (error) {
        console.error('Test newsletter error:', error);
        throw error;
      }
      
      console.log('Test newsletter results:', data);
      setSystemStatus(data.summary);
      toast.success('Test completato! Controlla i risultati qui sotto.');
    } catch (error) {
      console.error('Errore nel test newsletter:', error);
      toast.error(`Errore durante il test newsletter: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Effettua il login per gestire la newsletter.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Newsletter Personalizzata
          </CardTitle>
          <CardDescription>
            Gestisci la raccolta di contenuti e l'invio della newsletter giornaliera personalizzata.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Schedule Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Programma Automatico
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              La newsletter viene inviata automaticamente ogni giorno alle 8:00 (ora di Milano) 
              con contenuti personalizzati basati sui tuoi interessi.
            </p>
          </div>

          {/* Manual Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  Raccolta Contenuti
                </CardTitle>
                <CardDescription className="text-sm">
                  Avvia manualmente la raccolta di nuovi contenuti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleCollectContent}
                  disabled={isCollecting}
                  className="w-full"
                  variant="outline"
                >
                  {isCollecting ? 'Raccogliendo...' : 'Avvia Raccolta'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-500" />
                  Invio Newsletter
                </CardTitle>
                <CardDescription className="text-sm">
                  Invia immediatamente la newsletter personalizzata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleSendNewsletter}
                  disabled={isSending}
                  className="w-full"
                >
                  {isSending ? 'Inviando...' : 'Invia Newsletter'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-500" />
                  Test Sistema
                </CardTitle>
                <CardDescription className="text-sm">
                  Testa il sistema e visualizza i log di debug
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleTestNewsletter}
                  disabled={isTesting}
                  className="w-full"
                  variant="secondary"
                >
                  {isTesting ? 'Testando...' : 'Avvia Test'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          {systemStatus && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Stato del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{systemStatus.users_count}</div>
                    <div className="text-sm text-muted-foreground">Utenti</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{systemStatus.content_count}</div>
                    <div className="text-sm text-muted-foreground">Contenuti Recenti</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{systemStatus.content_topics_count}</div>
                    <div className="text-sm text-muted-foreground">Mappature Argomenti</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {systemStatus.api_keys?.resend ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {systemStatus.api_keys?.firecrawl ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">API Keys</div>
                  </div>
                </div>
                
                {systemStatus.users_count === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Nessun utente trovato</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Assicurati che ci siano utenti registrati con preferenze configurate.
                    </p>
                  </div>
                )}
                
                {systemStatus.content_count === 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800">Nessun contenuto recente</span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      Prova ad eseguire la raccolta contenuti per popolare il database.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Feature Overview */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Come Funziona
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">1</Badge>
                <h4 className="font-medium mb-1">Raccolta</h4>
                <p className="text-sm text-muted-foreground">
                  Il sistema raccoglie contenuti da fonti affidabili utilizzando Firecrawl
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">2</Badge>
                <h4 className="font-medium mb-1">Personalizzazione</h4>
                <p className="text-sm text-muted-foreground">
                  I contenuti vengono classificati e abbinati ai tuoi interessi
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">3</Badge>
                <h4 className="font-medium mb-1">Consegna</h4>
                <p className="text-sm text-muted-foreground">
                  Ricevi una newsletter personalizzata con 5 contenuti selezionati
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;