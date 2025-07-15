import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Activity, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface SystemLog {
  id: string;
  action: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: any;
  function_name?: string;
  execution_time_ms?: number;
  created_at: string;
}

const statusIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const statusColors = {
  success: 'bg-green-500/10 text-green-700 border-green-500/20',
  error: 'bg-red-500/10 text-red-700 border-red-500/20',
  warning: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  info: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
};

const SystemLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs((data || []) as SystemLog[]);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const getStatusIcon = (status: SystemLog['status']) => {
    const Icon = statusIcons[status];
    return <Icon className="h-4 w-4" />;
  };

  const formatExecutionTime = (timeMs?: number) => {
    if (!timeMs) return null;
    return timeMs < 1000 ? `${timeMs}ms` : `${(timeMs / 1000).toFixed(2)}s`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Log di Sistema</CardTitle>
              <CardDescription>
                Cronologia delle attività e operazioni del sistema
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Aggiorna
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nessun log disponibile</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={log.id}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(log.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {log.action}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={statusColors[log.status]}
                          >
                            {log.status}
                          </Badge>
                          {log.function_name && (
                            <Badge variant="secondary" className="text-xs">
                              {log.function_name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          {log.execution_time_ms && (
                            <span>{formatExecutionTime(log.execution_time_ms)}</span>
                          )}
                          <span>
                            {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: it })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                      {log.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            Mostra dettagli
                          </summary>
                          <pre className="text-xs bg-gray-50 p-2 mt-1 rounded border overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                  {index < logs.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SystemLogs;