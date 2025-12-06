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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
const observability_config_1 = require("../env/base/observability.config");
let MetricsService = class MetricsService {
    constructor() {
        this.config = (0, observability_config_1.observabilityConfig)();
        this.registry = new prom_client_1.Registry();
        const defaultLabels = {
            service: this.config.serviceName,
            version: this.config.serviceVersion,
        };
        this.registry.setDefaultLabels(defaultLabels);
        this.httpRequestsTotal = new prom_client_1.Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.registry],
        });
        this.httpRequestDuration = new prom_client_1.Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
            registers: [this.registry],
        });
        this.httpRequestsErrors = new prom_client_1.Counter({
            name: 'http_requests_errors_total',
            help: 'Total number of HTTP request errors',
            labelNames: ['method', 'route', 'error_type'],
            registers: [this.registry],
        });
        this.dbQueriesTotal = new prom_client_1.Counter({
            name: 'db_queries_total',
            help: 'Total number of database queries',
            labelNames: ['operation', 'table'],
            registers: [this.registry],
        });
        this.dbQueryDuration = new prom_client_1.Histogram({
            name: 'db_query_duration_seconds',
            help: 'Duration of database queries in seconds',
            labelNames: ['operation', 'table'],
            buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
            registers: [this.registry],
        });
        this.dbQueryErrors = new prom_client_1.Counter({
            name: 'db_query_errors_total',
            help: 'Total number of database query errors',
            labelNames: ['operation', 'table', 'error_type'],
            registers: [this.registry],
        });
    }
    recordHttpRequest(method, route, statusCode, duration) {
        if (!this.config.enableMetrics)
            return;
        this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
        this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
        if (statusCode >= 400) {
            this.httpRequestsErrors.inc({ method, route, error_type: statusCode >= 500 ? 'server_error' : 'client_error' });
        }
    }
    recordDbQuery(operation, table, duration, error) {
        if (!this.config.enableMetrics)
            return;
        this.dbQueriesTotal.inc({ operation, table });
        this.dbQueryDuration.observe({ operation, table }, duration);
        if (error) {
            this.dbQueryErrors.inc({ operation, table, error_type: error });
        }
    }
    async getMetrics() {
        return this.registry.metrics();
    }
    getRegistry() {
        return this.registry;
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map