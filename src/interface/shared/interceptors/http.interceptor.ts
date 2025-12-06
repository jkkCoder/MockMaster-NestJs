import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { httpConfig } from '@infrastructure/env/base/http.config';
import { v4 as uuidv4 } from 'uuid';

/**
 * HTTP Interceptor
 * 
 * Common interceptor for handling HTTP concerns in a single place:
 * - Request ID: Unique identifier for each request
 * - Correlation ID: For distributed tracing across services
 * - Security headers
 * - Future: Rate limiting, request validation, etc.
 * 
 * All headers are automatically added to responses and can be read from requests
 */
@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private readonly config = httpConfig();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Generate or use existing Request ID
    if (this.config.enableRequestId) {
      const requestId =
        request.headers[this.config.requestIdHeader.toLowerCase()] ||
        uuidv4();
      request.headers[this.config.requestIdHeader.toLowerCase()] = requestId;
      response.setHeader(this.config.requestIdHeader, requestId);
    }

    // Generate or use existing Correlation ID (for distributed tracing)
    if (this.config.enableCorrelationId) {
      const correlationId =
        request.headers[this.config.correlationIdHeader.toLowerCase()] ||
        request.headers[this.config.requestIdHeader.toLowerCase()] ||
        uuidv4();
      request.headers[this.config.correlationIdHeader.toLowerCase()] = correlationId;
      response.setHeader(this.config.correlationIdHeader, correlationId);
    }

    // Security headers
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Add request ID and correlation ID to request object for easy access
    if (this.config.enableRequestId) {
      (request as any).requestId = request.headers[this.config.requestIdHeader.toLowerCase()];
    }
    if (this.config.enableCorrelationId) {
      (request as any).correlationId = request.headers[this.config.correlationIdHeader.toLowerCase()];
    }

    return next.handle();
  }
}

