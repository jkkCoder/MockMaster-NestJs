/**
 * ENVIRONMENT CONFIGURATION AGGREGATOR
 *
 * ⚠️ CRITICAL RULES FOR CURSOR AI:
 * 
 * 1. NEVER read process.env directly in service files, modules, or controllers
 * 2. NEVER use ConfigService.get() from @nestjs/config to read env vars
 * 3. ALWAYS import config from this file or specific config files in base/
 * 4. ALL new environment variables MUST be defined in base/*.config.ts files FIRST
 * 5. This ensures type safety, validation, and centralized configuration
 *
 * Usage:
 *   import { env } from '@infrastructure/env/base';
 *   const port = env.app.port;
 *   const dbHost = env.database.host;
 */

import { appConfig, AppConfig } from './app.config';
import { databaseConfig, DatabaseConfig } from './database.config';
import { observabilityConfig, ObservabilityConfig } from './observability.config';
import { authConfig, AuthConfig } from './auth.config';
import { httpConfig, HttpConfig } from './http.config';
import { apiConfig, ApiConfig } from './api.config';

export interface EnvironmentConfig {
  app: AppConfig;
  database: DatabaseConfig;
  observability: ObservabilityConfig;
  auth: AuthConfig;
  http: HttpConfig;
  api: ApiConfig;
}

/**
 * Validates and loads all environment configuration
 * Throws if any required env vars are missing or invalid
 */
export const loadEnvironmentConfig = (): EnvironmentConfig => {
  try {
    return {
      app: appConfig(),
      database: databaseConfig(),
      observability: observabilityConfig(),
      auth: authConfig(),
      http: httpConfig(),
      api: apiConfig(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Environment configuration validation failed: ${error.message}\n` +
          `Run 'npm run env:validate' to check your environment configuration.`,
      );
    }
    throw error;
  }
};

/**
 * Singleton instance of validated environment config
 * Use this throughout the application instead of process.env
 */
export const env = loadEnvironmentConfig();

// Export individual configs for convenience
export { appConfig, type AppConfig } from './app.config';
export { databaseConfig, type DatabaseConfig } from './database.config';
export { observabilityConfig, type ObservabilityConfig } from './observability.config';
export { authConfig, type AuthConfig } from './auth.config';
export { httpConfig, type HttpConfig } from './http.config';
export { apiConfig, type ApiConfig } from './api.config';
