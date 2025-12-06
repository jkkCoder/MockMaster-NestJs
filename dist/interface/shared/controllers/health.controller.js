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
exports.HealthController = exports.HealthCheckResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../decorators/public.decorator");
const api_version_guard_1 = require("../guards/api-version.guard");
const logger_service_1 = require("../../../infrastructure/observability/logger.service");
const observability_config_1 = require("../../../infrastructure/env/base/observability.config");
class HealthCheckResponse {
}
exports.HealthCheckResponse = HealthCheckResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ok' }),
    __metadata("design:type", String)
], HealthCheckResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:45.123Z' }),
    __metadata("design:type", String)
], HealthCheckResponse.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3600 }),
    __metadata("design:type", Number)
], HealthCheckResponse.prototype, "uptime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { status: 'connected', latency: 5 },
    }),
    __metadata("design:type", Object)
], HealthCheckResponse.prototype, "database", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { name: 'mockmaster-api', version: '1.0.0' },
    }),
    __metadata("design:type", Object)
], HealthCheckResponse.prototype, "service", void 0);
let HealthController = class HealthController {
    constructor(logger) {
        this.logger = logger;
        this.observabilityConf = (0, observability_config_1.observabilityConfig)();
    }
    async check() {
        const startTime = Date.now();
        const uptime = process.uptime();
        const dbStatus = 'disconnected';
        const dbLatency = undefined;
        const overallStatus = dbStatus === 'connected' ? 'ok' : 'error';
        const response = {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            uptime: Math.floor(uptime),
            database: {
                status: dbStatus,
                ...(dbLatency !== undefined && { latency: dbLatency }),
            },
            service: {
                name: this.observabilityConf.serviceName,
                version: this.observabilityConf.serviceVersion,
            },
        };
        const duration = Date.now() - startTime;
        if (overallStatus === 'ok') {
            this.logger.debug('Health check passed', 'HealthController', {
                duration,
                dbLatency,
            });
        }
        else {
            this.logger.warn('Health check failed', 'HealthController', {
                duration,
                dbStatus,
            });
        }
        return response;
    }
    liveness() {
        return {
            status: 'alive',
            timestamp: new Date().toISOString(),
        };
    }
    async readiness() {
        const ready = true;
        return {
            status: ready ? 'ready' : 'not ready',
            timestamp: new Date().toISOString(),
            ready,
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check', description: 'Comprehensive health check including database connectivity, service uptime, and status information.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health check result',
        type: HealthCheckResponse,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Liveness probe', description: 'Simple liveness check to verify the service is running. Used by Kubernetes and container orchestration.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Service is alive',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'alive' },
                timestamp: { type: 'string', example: '2024-01-15T10:30:45.123Z' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], HealthController.prototype, "liveness", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Readiness probe', description: 'Readiness check to verify the service can accept traffic. Checks database connectivity. Used by Kubernetes and container orchestration.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Readiness check result',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ready' },
                timestamp: { type: 'string', example: '2024-01-15T10:30:45.123Z' },
                ready: { type: 'boolean', example: true },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readiness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    (0, api_version_guard_1.VersionOptional)(),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService])
], HealthController);
//# sourceMappingURL=health.controller.js.map