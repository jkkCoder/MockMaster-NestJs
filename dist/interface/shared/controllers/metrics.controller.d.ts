import { MetricsService } from '@infrastructure/observability/metrics.service';
export declare class MetricsController {
    private readonly metricsService;
    constructor(metricsService: MetricsService);
    getMetrics(): Promise<string>;
}
