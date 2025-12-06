import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { MetricsService } from '@infrastructure/observability/metrics.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logger;
    private readonly metrics;
    constructor(logger: AppLoggerService, metrics: MetricsService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
