type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

class Logger {
  private formatMessage(log: LogMessage): string {
    const timestamp = new Date().toISOString();
    const metadata = log.metadata ? ` ${JSON.stringify(log.metadata)}` : '';
    return `[${timestamp}] ${log.level.toUpperCase()}: ${log.message}${metadata}`;
  }

  info(message: string, metadata?: Record<string, any>) {
    console.log(this.formatMessage({ level: 'info', message, metadata }));
  }

  error(message: string, error?: any) {
    console.error(this.formatMessage({ 
      level: 'error', 
      message, 
      metadata: error instanceof Error ? { 
        message: error.message,
        stack: error.stack 
      } : error 
    }));
  }

  warn(message: string, metadata?: Record<string, any>) {
    console.warn(this.formatMessage({ level: 'warn', message, metadata }));
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage({ level: 'debug', message, metadata }));
    }
  }
}

export const logger = new Logger(); 