import { Injectable, LoggerService } from '@nestjs/common';
import { observabilityConfig } from '../env/base/observability.config';

export interface LogContext {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * Enterprise logging service supporting:
 * - Console output (human-readable) for local development
 * - Structured JSON output for CloudWatch and log aggregators
 * - Configurable log levels
 * - Contextual metadata support
 */
@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly config = observabilityConfig();
  private readonly isProduction = process.env.NODE_ENV === 'production';

  log(message: string, context?: string | LogContext, metadata?: LogContext): void {
    this.writeLog('info', message, context, metadata);
  }

  error(message: string, trace?: string, context?: string | LogContext, metadata?: LogContext): void {
    this.writeLog('error', message, context, { ...metadata, trace });
  }

  warn(message: string, context?: string | LogContext, metadata?: LogContext): void {
    this.writeLog('warn', message, context, metadata);
  }

  debug(message: string, context?: string | LogContext, metadata?: LogContext): void {
    this.writeLog('debug', message, context, metadata);
  }

  verbose(message: string, context?: string | LogContext, metadata?: LogContext): void {
    this.writeLog('verbose', message, context, metadata);
  }

  /**
   * Log with structured context (useful for CloudWatch)
   * Example: logger.logWithContext('User created', { userId: '123', email: 'user@example.com' }, 'UserService')
   */
  logWithContext(
    level: 'info' | 'error' | 'warn' | 'debug' | 'verbose',
    message: string,
    context: LogContext,
    serviceContext?: string,
  ): void {
    this.writeLog(level, message, serviceContext, context);
  }

  private writeLog(
    level: string,
    message: string,
    context?: string | LogContext,
    metadata?: LogContext,
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logContext = typeof context === 'string' ? context : undefined;
    const logMetadata = typeof context === 'object' ? context : metadata || {};

    if (this.isProduction) {
      // Structured JSON for CloudWatch and log aggregators
      const logEntry = {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...(logContext && { context: logContext }),
        ...logMetadata,
        service: this.config.serviceName,
        version: this.config.serviceVersion,
      };
      console.log(JSON.stringify(logEntry));
    } else {
      // Human-readable format for local development
      const contextStr = logContext ? `[${logContext}]` : '';
      const metadataStr =
        Object.keys(logMetadata).length > 0
          ? ` ${JSON.stringify(logMetadata)}`
          : '';
      const levelEmoji = this.getLevelEmoji(level);
      console.log(
        `${levelEmoji} [${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}${metadataStr}`,
      );
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug', 'verbose'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private getLevelEmoji(level: string): string {
    const emojis: Record<string, string> = {
      error: '❌',
      warn: '⚠️',
      info: 'ℹ️',
      debug: '🔍',
      verbose: '📝',
    };
    return emojis[level] || 'ℹ️';
  }
}
