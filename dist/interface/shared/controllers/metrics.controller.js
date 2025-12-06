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
exports.MetricsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const metrics_service_1 = require("../../../infrastructure/observability/metrics.service");
const public_decorator_1 = require("../decorators/public.decorator");
const api_version_guard_1 = require("../guards/api-version.guard");
let MetricsController = class MetricsController {
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    async getMetrics() {
        return this.metricsService.getMetrics();
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.Get)('metrics'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Header)('Content-Type', 'text/plain'),
    (0, swagger_1.ApiOperation)({ summary: 'Prometheus metrics', description: 'Expose Prometheus-compatible metrics for monitoring and alerting.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prometheus metrics in plain text format',
        content: {
            'text/plain': {
                schema: {
                    type: 'string',
                    example: '# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\nhttp_requests_total{method="GET",route="/users",status_code="200"} 10',
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getMetrics", null);
exports.MetricsController = MetricsController = __decorate([
    (0, swagger_1.ApiTags)('metrics'),
    (0, common_1.Controller)(),
    (0, api_version_guard_1.VersionOptional)(),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], MetricsController);
//# sourceMappingURL=metrics.controller.js.map