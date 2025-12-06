import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { authConfig } from '@infrastructure/env/base/auth.config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  requestId?: string;
  correlationId?: string;
}

/**
 * JWT Authentication Guard
 * 
 * Validates JWT tokens from Authorization header
 * Format: "Bearer <token>"
 * 
 * Usage:
 * @UseGuards(AuthGuard)
 * @Controller('protected')
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly config = authConfig();

  constructor(
    private readonly logger: AppLoggerService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!this.config.enableAuth) {
      // Auth is disabled, allow all requests
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Authentication failed - no token provided', 'AuthGuard', {
        path: request.path,
        method: request.method,
        requestId: request.requestId,
      });
      throw new UnauthorizedException('Authentication token is required');
    }

    try {
      const payload = jwt.verify(token, this.config.jwtSecret, {
        algorithms: [this.config.jwtAlgorithm],
      }) as JwtPayload;

      // Attach user to request for use in controllers
      request.user = payload;

      this.logger.debug('Authentication successful', 'AuthGuard', {
        userId: payload.userId,
        email: payload.email,
        path: request.path,
        requestId: request.requestId,
      });

      return true;
    } catch (error) {
      this.logger.warn('Authentication failed - invalid token', 'AuthGuard', {
        path: request.path,
        method: request.method,
        error: error instanceof Error ? error.message : 'unknown',
        requestId: request.requestId,
      });
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

