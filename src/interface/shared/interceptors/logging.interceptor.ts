import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { MetricsService } from '@infrastructure/observability/metrics.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly metrics: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, route } = request;
    const routePath = route?.path || url;

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - startTime) / 1000;
        const statusCode = response.statusCode;

        this.logger.log(
          `${method} ${routePath} ${statusCode} - ${duration.toFixed(3)}s`,
          'HTTP',
        );

        this.metrics.recordHttpRequest(method, routePath, statusCode, duration);
      }),
      catchError((error: any) => {
        const duration = (Date.now() - startTime) / 1000;
        const statusCode = error.status || 500;

        this.logger.error(
          `${method} ${routePath} ${statusCode} - ${duration.toFixed(3)}s`,
          error.stack,
          'HTTP',
        );

        this.metrics.recordHttpRequest(method, routePath, statusCode, duration);

        throw error;
      }),
    );
  }
}

