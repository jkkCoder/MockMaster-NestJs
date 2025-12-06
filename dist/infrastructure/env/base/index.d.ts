import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { ObservabilityConfig } from './observability.config';
import { AuthConfig } from './auth.config';
import { HttpConfig } from './http.config';
import { ApiConfig } from './api.config';
export interface EnvironmentConfig {
    app: AppConfig;
    database: DatabaseConfig;
    observability: ObservabilityConfig;
    auth: AuthConfig;
    http: HttpConfig;
    api: ApiConfig;
}
export declare const loadEnvironmentConfig: () => EnvironmentConfig;
export declare const env: EnvironmentConfig;
export { appConfig, type AppConfig } from './app.config';
export { databaseConfig, type DatabaseConfig } from './database.config';
export { observabilityConfig, type ObservabilityConfig } from './observability.config';
export { authConfig, type AuthConfig } from './auth.config';
export { httpConfig, type HttpConfig } from './http.config';
export { apiConfig, type ApiConfig } from './api.config';
