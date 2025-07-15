import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Database, Mail, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

const SystemDiagnostics = () => {
  const { user } = useAuth();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    if (!user) return;
    
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    try {
      // Test 1: Check user preferences
      const { data: preferences, error: prefsError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id);

      results.push({
        name: 'User Preferences',
        status: preferences && preferences.length > 0 ? 'success' : 'warning',
        message: preferences && preferences.length > 0 
          ? `${preferences.length} preferences configured` 
          : 'No preferences found - configure your interests first',
        details: preferences?.length || 0
      });

      // Test 2: Check recent content
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('id, title, published_at')
        .gte('published_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(5);

      results.push({
        name: 'Recent Content',
        status: content && content.length > 0 ? 'success' : 'warning',
        message: content && content.length > 0 
          ? `${content.length} recent articles found` 
          : 'No recent content - try running content collection',
        details: content?.length || 0
      });

      // Test 3: Check topics
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id')
        .limit(1);

      results.push({
        name: 'Topics Database',
        status: topics && topics.length > 0 ? 'success' : 'error',
        message: topics && topics.length > 0 
          ? 'Topics database populated' 
          : 'Topics database empty - run topic seeder',
        details: topics?.length || 0
      });

      // Test 4: Check content-topics mapping
      const { data: contentTopics, error: ctError } = await supabase
        .from('content_topics')
        .select('id')
        .limit(1);

      results.push({
        name: 'Content Classification',
        status: contentTopics && contentTopics.length > 0 ? 'success' : 'warning',
        message: contentTopics && contentTopics.length > 0 
          ? 'Content is being classified' 
          : 'No content-topic mappings found',
        details: contentTopics?.length || 0
      });

      // Test 5: Test edge function connectivity
      try {
        const { data: testData, error: testError } = await supabase.functions.invoke('test-newsletter');
        results.push({
          name: 'Edge Functions',
          status: testError ? 'error' : 'success',
          message: testError ? `Function error: ${testError.message}` : 'Edge functions accessible',
          details: testData
        });
      } catch (error) {
        results.push({
          name: 'Edge Functions',
          status: 'error',
          message: `Cannot reach edge functions: ${error.message}`,
          details: null
        });
      }

    } catch (error) {
      results.push({
        name: 'System Error',
        status: 'error',
        message: `Diagnostic failed: ${error.message}`,
        details: null
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    if (user) {
      runDiagnostics();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Login required to run system diagnostics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-500" />
          System Diagnostics
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Check the health of your newsletter system
          </p>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            {isRunning ? 'Running...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {diagnostics.map((result, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(result.status)}
                <span className="font-medium">{result.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {result.status}
              </Badge>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              {result.message}
            </p>
          </div>
        ))}

        {diagnostics.length === 0 && !isRunning && (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Click "Refresh" to run system diagnostics</p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Running diagnostics...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemDiagnostics;