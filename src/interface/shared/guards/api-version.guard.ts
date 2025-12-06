import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { apiConfig } from '@infrastructure/env/base/api.config';
import { AppLoggerService } from '@infrastructure/observability/logger.service';

export const API_VERSION_KEY = Symbol('apiVersion');
export const VERSION_OPTIONAL_KEY = Symbol('versionOptional');

/**
 * Decorator to specify API version for a controller/route
 */
export const ApiVersion = (...versions: string[]) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(API_VERSION_KEY, versions, descriptor.value);
    } else {
      Reflect.defineMetadata(API_VERSION_KEY, versions, target);
    }
  };
};

/**
 * Decorator to mark a route as version-optional
 * Allows route to work without version specification
 */
export const VersionOptional = () => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(VERSION_OPTIONAL_KEY, true, descriptor.value);
    } else {
      Reflect.defineMetadata(VERSION_OPTIONAL_KEY, true, target);
    }
  };
};

/**
 * API Version Guard
 *
 * Validates API version from URL or headers based on configured strategy.
 * Supports both URL-based (/api/v1/users) and header-based (Accept: application/vnd.api+json;version=1) versioning.
 *
 * Enterprise-level features:
 * - Multiple versioning strategies
 * - Version negotiation
 * - Strict version checking
 * - Per-route version specification
 */
@Injectable()
export class ApiVersionGuard implements CanActivate {
  private readonly config = apiConfig();

  constructor(
    private readonly logger: AppLoggerService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // For URL-based versioning, version is handled by global prefix in main.ts
    // This guard only activates for header-based or both strategies
    if (this.config.versioningStrategy === 'url') {
      // URL versioning is handled via global prefix, so allow all requests
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Check if route is version-optional
    const isVersionOptional = this.reflector.getAllAndOverride<boolean>(
      VERSION_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isVersionOptional && !this.config.strictVersioning) {
      return true;
    }

    // Extract version from URL or header
    const requestedVersion = this.extractVersion(request);

    // If no version requested and not strict, use default
    if (!requestedVersion) {
      if (!this.config.strictVersioning || isVersionOptional) {
        (request as any).apiVersion = this.config.defaultVersion;
        return true;
      }
      throw new BadRequestException(
        `API version is required. Supported versions: ${this.config.supportedVersions.join(', ')}`,
      );
    }

    // Normalize version format (e.g., '1' -> 'v1')
    const normalizedVersion = requestedVersion.startsWith('v')
      ? requestedVersion
      : `v${requestedVersion}`;

    // Check if version is supported
    const isSupported = this.config.supportedVersions.includes(normalizedVersion);

    if (!isSupported) {
      if (this.config.enableVersionNegotiation && !this.config.strictVersioning) {
        // Use default version if negotiation is enabled
        this.logger.warn(
          `Unsupported version ${normalizedVersion} requested, using default ${this.config.defaultVersion}`,
          'ApiVersionGuard',
          {
            requestedVersion: normalizedVersion,
            defaultVersion: this.config.defaultVersion,
            supportedVersions: this.config.supportedVersions.join(','),
            path: request.path,
          },
        );
        (request as any).apiVersion = this.config.defaultVersion;
        return true;
      }

      throw new NotFoundException(
        `API version '${normalizedVersion}' is not supported. Supported versions: ${this.config.supportedVersions.join(', ')}`,
      );
    }

    // Attach version to request for use in controllers
    (request as any).apiVersion = normalizedVersion;

    this.logger.debug('API version validated', 'ApiVersionGuard', {
      version: normalizedVersion,
      path: request.path,
      strategy: this.config.versioningStrategy,
    });

    return true;
  }

  /**
   * Extract API version from request
   * Supports both URL-based and header-based versioning
   */
  private extractVersion(request: Request): string | null {
    // Try URL-based versioning first (if enabled)
    if (this.config.versioningStrategy === 'url' || this.config.versioningStrategy === 'both') {
      const urlMatch = request.path.match(/\/api\/v(\d+)\//);
      if (urlMatch) {
        return urlMatch[1];
      }
    }

    // Try header-based versioning (if enabled)
    if (this.config.versioningStrategy === 'header' || this.config.versioningStrategy === 'both') {
      const acceptHeader = request.headers[this.config.versionHeader.toLowerCase()] as string;
      if (acceptHeader) {
        // Extract version from: application/vnd.api+json;version=1
        const versionMatch = acceptHeader.match(/version[=:](\d+)/i);
        if (versionMatch) {
          return versionMatch[1];
        }

        // Alternative: Check if header contains the pattern
        if (acceptHeader.includes(this.config.versionHeaderPattern)) {
          // Try to extract version from Accept header
          const patternMatch = acceptHeader.match(
            new RegExp(`${this.config.versionHeaderPattern.replace(/\+/g, '\\+')}[^;]*;version=(\\d+)`, 'i'),
          );
          if (patternMatch) {
            return patternMatch[1];
          }
        }
      }
    }

    return null;
  }
}

