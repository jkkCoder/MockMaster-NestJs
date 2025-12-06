import { AppLoggerService } from '@infrastructure/observability/logger.service';
export declare class HealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    database: {
        status: 'connected' | 'disconnected';
        latency?: number;
    };
    service: {
        name: string;
        version: string;
    };
}
export declare class HealthController {
    private readonly logger;
    private readonly observabilityConf;
    constructor(logger: AppLoggerService);
    check(): Promise<HealthCheckResponse>;
    liveness(): {
        status: string;
        timestamp: string;
    };
    readiness(): Promise<{
        status: string;
        timestamp: string;
        ready: boolean;
    }>;
}
