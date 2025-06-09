type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  timestamp: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: Record<string, any>): LogMessage {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private log(level: LogLevel, message: string, data?: Record<string, any>): void {
    const logMessage = this.formatMessage(level, message, data);
    
    if (this.isDevelopment) {
      console.log(JSON.stringify(logMessage, null, 2));
    } else {
      // In production, you might want to send logs to a service like CloudWatch, Datadog, etc.
      console.log(JSON.stringify(logMessage));
    }
  }

  public info(message: string, data?: Record<string, any>): void {
    this.log('info', message, data);
  }

  public error(message: string, data?: Record<string, any>): void {
    this.log('error', message, data);
  }

  public warn(message: string, data?: Record<string, any>): void {
    this.log('warn', message, data);
  }

  public debug(message: string, data?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }
}

export const logger = Logger.getInstance(); 