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
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const logger_service_1 = require("../../../infrastructure/observability/logger.service");
const metrics_service_1 = require("../../../infrastructure/observability/metrics.service");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(logger, metrics) {
        this.logger = logger;
        this.metrics = metrics;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, route } = request;
        const routePath = route?.path || url;
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = (Date.now() - startTime) / 1000;
            const statusCode = response.statusCode;
            this.logger.log(`${method} ${routePath} ${statusCode} - ${duration.toFixed(3)}s`, 'HTTP');
            this.metrics.recordHttpRequest(method, routePath, statusCode, duration);
        }), (0, operators_1.catchError)((error) => {
            const duration = (Date.now() - startTime) / 1000;
            const statusCode = error.status || 500;
            this.logger.error(`${method} ${routePath} ${statusCode} - ${duration.toFixed(3)}s`, error.stack, 'HTTP');
            this.metrics.recordHttpRequest(method, routePath, statusCode, duration);
            throw error;
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService,
        metrics_service_1.MetricsService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map