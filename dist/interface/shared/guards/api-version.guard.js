"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiVersionGuard = exports.VersionOptional = exports.ApiVersion = exports.VERSION_OPTIONAL_KEY = exports.API_VERSION_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const api_config_1 = require("../../../infrastructure/env/base/api.config");
const logger_service_1 = require("../../../infrastructure/observability/logger.service");
exports.API_VERSION_KEY = Symbol('apiVersion');
exports.VERSION_OPTIONAL_KEY = Symbol('versionOptional');
const ApiVersion = (...versions) => {
    return (target, propertyKey, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(exports.API_VERSION_KEY, versions, descriptor.value);
        }
        else {
            Reflect.defineMetadata(exports.API_VERSION_KEY, versions, target);
        }
    };
};
exports.ApiVersion = ApiVersion;
const VersionOptional = () => {
    return (target, propertyKey, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(exports.VERSION_OPTIONAL_KEY, true, descriptor.value);
        }
        else {
            Reflect.defineMetadata(exports.VERSION_OPTIONAL_KEY, true, target);
        }
    };
};
exports.VersionOptional = VersionOptional;
let ApiVersionGuard = class ApiVersionGuard {
    constructor(logger, reflector) {
        this.logger = logger;
        this.reflector = reflector;
        this.config = (0, api_config_1.apiConfig)();
    }
    canActivate(context) {
        if (this.config.versioningStrategy === 'url') {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const isVersionOptional = this.reflector.getAllAndOverride(exports.VERSION_OPTIONAL_KEY, [context.getHandler(), context.getClass()]);
        if (isVersionOptional && !this.config.strictVersioning) {
            return true;
        }
        const requestedVersion = this.extractVersion(request);
        if (!requestedVersion) {
            if (!this.config.strictVersioning || isVersionOptional) {
                request.apiVersion = this.config.defaultVersion;
                return true;
            }
            throw new common_1.BadRequestException(`API version is required. Supported versions: ${this.config.supportedVersions.join(', ')}`);
        }
        const normalizedVersion = requestedVersion.startsWith('v')
            ? requestedVersion
            : `v${requestedVersion}`;
        const isSupported = this.config.supportedVersions.includes(normalizedVersion);
        if (!isSupported) {
            if (this.config.enableVersionNegotiation && !this.config.strictVersioning) {
                this.logger.warn(`Unsupported version ${normalizedVersion} requested, using default ${this.config.defaultVersion}`, 'ApiVersionGuard', {
                    requestedVersion: normalizedVersion,
                    defaultVersion: this.config.defaultVersion,
                    supportedVersions: this.config.supportedVersions.join(','),
                    path: request.path,
                });
                request.apiVersion = this.config.defaultVersion;
                return true;
            }
            throw new common_1.NotFoundException(`API version '${normalizedVersion}' is not supported. Supported versions: ${this.config.supportedVersions.join(', ')}`);
        }
        request.apiVersion = normalizedVersion;
        this.logger.debug('API version validated', 'ApiVersionGuard', {
            version: normalizedVersion,
            path: request.path,
            strategy: this.config.versioningStrategy,
        });
        return true;
    }
    extractVersion(request) {
        if (this.config.versioningStrategy === 'url' || this.config.versioningStrategy === 'both') {
            const urlMatch = request.path.match(/\/api\/v(\d+)\//);
            if (urlMatch) {
                return urlMatch[1];
            }
        }
        if (this.config.versioningStrategy === 'header' || this.config.versioningStrategy === 'both') {
            const acceptHeader = request.headers[this.config.versionHeader.toLowerCase()];
            if (acceptHeader) {
                const versionMatch = acceptHeader.match(/version[=:](\d+)/i);
                if (versionMatch) {
                    return versionMatch[1];
                }
                if (acceptHeader.includes(this.config.versionHeaderPattern)) {
                    const patternMatch = acceptHeader.match(new RegExp(`${this.config.versionHeaderPattern.replace(/\+/g, '\\+')}[^;]*;version=(\\d+)`, 'i'));
                    if (patternMatch) {
                        return patternMatch[1];
                    }
                }
            }
        }
        return null;
    }
};
exports.ApiVersionGuard = ApiVersionGuard;
exports.ApiVersionGuard = ApiVersionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService,
        core_1.Reflector])
], ApiVersionGuard);
//# sourceMappingURL=api-version.guard.js.map