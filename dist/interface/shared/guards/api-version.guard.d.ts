import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
export declare const API_VERSION_KEY: unique symbol;
export declare const VERSION_OPTIONAL_KEY: unique symbol;
export declare const ApiVersion: (...versions: string[]) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare const VersionOptional: () => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare class ApiVersionGuard implements CanActivate {
    private readonly logger;
    private readonly reflector;
    private readonly config;
    constructor(logger: AppLoggerService, reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
    private extractVersion;
}
