import { Registry } from 'prom-client';
export declare class MetricsService {
    private readonly registry;
    private readonly config;
    private readonly httpRequestsTotal;
    private readonly httpRequestDuration;
    private readonly httpRequestsErrors;
    private readonly dbQueriesTotal;
    private readonly dbQueryDuration;
    private readonly dbQueryErrors;
    constructor();
    recordHttpRequest(method: string, route: string, statusCode: number, duration: number): void;
    recordDbQuery(operation: string, table: string, duration: number, error?: string): void;
    getMetrics(): Promise<string>;
    getRegistry(): Registry;
}
