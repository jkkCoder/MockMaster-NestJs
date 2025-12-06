import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Registry } from 'prom-client';
import { observabilityConfig } from '../env/base/observability.config';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly config = observabilityConfig();

  // HTTP Metrics
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly httpRequestsErrors: Counter<string>;

  // Database Metrics
  private readonly dbQueriesTotal: Counter<string>;
  private readonly dbQueryDuration: Histogram<string>;
  private readonly dbQueryErrors: Counter<string>;

  constructor() {
    this.registry = new Registry();

    // Default labels for all metrics
    const defaultLabels = {
      service: this.config.serviceName,
      version: this.config.serviceVersion,
    };
    this.registry.setDefaultLabels(defaultLabels);

    // HTTP Metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [this.registry],
    });

    this.httpRequestsErrors = new Counter({
      name: 'http_requests_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'error_type'],
      registers: [this.registry],
    });

    // Database Metrics
    this.dbQueriesTotal = new Counter({
      name: 'db_queries_total',
      help: 'Total number of database queries',
      labelNames: ['operation', 'table'],
      registers: [this.registry],
    });

    this.dbQueryDuration = new Histogram({
      name: 'db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    this.dbQueryErrors = new Counter({
      name: 'db_query_errors_total',
      help: 'Total number of database query errors',
      labelNames: ['operation', 'table', 'error_type'],
      registers: [this.registry],
    });
  }

  // HTTP Metrics Methods
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    if (!this.config.enableMetrics) return;

    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
    this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);

    if (statusCode >= 400) {
      this.httpRequestsErrors.inc({ method, route, error_type: statusCode >= 500 ? 'server_error' : 'client_error' });
    }
  }

  // Database Metrics Methods
  recordDbQuery(operation: string, table: string, duration: number, error?: string) {
    if (!this.config.enableMetrics) return;

    this.dbQueriesTotal.inc({ operation, table });
    this.dbQueryDuration.observe({ operation, table }, duration);

    if (error) {
      this.dbQueryErrors.inc({ operation, table, error_type: error });
    }
  }

  // Get metrics for Prometheus scraping
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getRegistry(): Registry {
    return this.registry;
  }
}

