import { supabase } from '@/integrations/supabase/client';

type LogLevel = 'success' | 'error' | 'warning' | 'info';

interface LogData {
  action: string;
  message: string;
  userId?: string;
  details?: any;
  functionName?: string;
  executionTimeMs?: number;
}

export const logger = {
  async log(level: LogLevel, data: LogData) {
    try {
      const logEntry = {
        user_id: data.userId || null,
        action: data.action,
        status: level,
        message: data.message,
        details: data.details || null,
        function_name: data.functionName || null,
        execution_time_ms: data.executionTimeMs || null
      };

      const { error } = await supabase
        .from('system_logs')
        .insert(logEntry);

      if (error) {
        console.error('Failed to write log:', error);
      }
    } catch (error) {
      console.error('Logger error:', error);
    }
  },

  success(data: LogData) {
    return this.log('success', data);
  },

  error(data: LogData) {
    return this.log('error', data);
  },

  warning(data: LogData) {
    return this.log('warning', data);
  },

  info(data: LogData) {
    return this.log('info', data);
  }
};

// Helper function for edge functions to create standardized logs
export const createEdgeLogger = (functionName: string, userId?: string) => {
  const startTime = Date.now();

  return {
    success: (action: string, message: string, details?: any) => {
      const executionTime = Date.now() - startTime;
      return logger.success({
        action,
        message,
        userId,
        details,
        functionName,
        executionTimeMs: executionTime
      });
    },

    error: (action: string, message: string, details?: any) => {
      const executionTime = Date.now() - startTime;
      return logger.error({
        action,
        message,
        userId,
        details,
        functionName,
        executionTimeMs: executionTime
      });
    },

    warning: (action: string, message: string, details?: any) => {
      const executionTime = Date.now() - startTime;
      return logger.warning({
        action,
        message,
        userId,
        details,
        functionName,
        executionTimeMs: executionTime
      });
    },

    info: (action: string, message: string, details?: any) => {
      const executionTime = Date.now() - startTime;
      return logger.info({
        action,
        message,
        userId,
        details,
        functionName,
        executionTimeMs: executionTime
      });
    }
  };
};