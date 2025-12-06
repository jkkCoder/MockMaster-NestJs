import { LoggerService } from '@nestjs/common';
export interface LogContext {
    [key: string]: string | number | boolean | undefined | null;
}
export declare class AppLoggerService implements LoggerService {
    private readonly config;
    private readonly isProduction;
    log(message: string, context?: string | LogContext, metadata?: LogContext): void;
    error(message: string, trace?: string, context?: string | LogContext, metadata?: LogContext): void;
    warn(message: string, context?: string | LogContext, metadata?: LogContext): void;
    debug(message: string, context?: string | LogContext, metadata?: LogContext): void;
    verbose(message: string, context?: string | LogContext, metadata?: LogContext): void;
    logWithContext(level: 'info' | 'error' | 'warn' | 'debug' | 'verbose', message: string, context: LogContext, serviceContext?: string): void;
    private writeLog;
    private shouldLog;
    private getLevelEmoji;
}
