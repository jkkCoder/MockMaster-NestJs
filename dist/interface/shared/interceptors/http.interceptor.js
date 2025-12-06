"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpInterceptor = void 0;
const common_1 = require("@nestjs/common");
const http_config_1 = require("../../../infrastructure/env/base/http.config");
const uuid_1 = require("uuid");
let HttpInterceptor = class HttpInterceptor {
    constructor() {
        this.config = (0, http_config_1.httpConfig)();
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (this.config.enableRequestId) {
            const requestId = request.headers[this.config.requestIdHeader.toLowerCase()] ||
                (0, uuid_1.v4)();
            request.headers[this.config.requestIdHeader.toLowerCase()] = requestId;
            response.setHeader(this.config.requestIdHeader, requestId);
        }
        if (this.config.enableCorrelationId) {
            const correlationId = request.headers[this.config.correlationIdHeader.toLowerCase()] ||
                request.headers[this.config.requestIdHeader.toLowerCase()] ||
                (0, uuid_1.v4)();
            request.headers[this.config.correlationIdHeader.toLowerCase()] = correlationId;
            response.setHeader(this.config.correlationIdHeader, correlationId);
        }
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('X-Frame-Options', 'DENY');
        response.setHeader('X-XSS-Protection', '1; mode=block');
        response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        if (this.config.enableRequestId) {
            request.requestId = request.headers[this.config.requestIdHeader.toLowerCase()];
        }
        if (this.config.enableCorrelationId) {
            request.correlationId = request.headers[this.config.correlationIdHeader.toLowerCase()];
        }
        return next.handle();
    }
};
exports.HttpInterceptor = HttpInterceptor;
exports.HttpInterceptor = HttpInterceptor = __decorate([
    (0, common_1.Injectable)()
], HttpInterceptor);
//# sourceMappingURL=http.interceptor.js.map