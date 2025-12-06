import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
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
export declare class AuthGuard implements CanActivate {
    private readonly logger;
    private readonly reflector;
    private readonly config;
    constructor(logger: AppLoggerService, reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
    private extractTokenFromHeader;
}
