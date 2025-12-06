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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const logger_service_1 = require("../../../infrastructure/observability/logger.service");
const auth_config_1 = require("../../../infrastructure/env/base/auth.config");
const public_decorator_1 = require("../decorators/public.decorator");
const jwt = require("jsonwebtoken");
let AuthGuard = class AuthGuard {
    constructor(logger, reflector) {
        this.logger = logger;
        this.reflector = reflector;
        this.config = (0, auth_config_1.authConfig)();
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        if (!this.config.enableAuth) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            this.logger.warn('Authentication failed - no token provided', 'AuthGuard', {
                path: request.path,
                method: request.method,
                requestId: request.requestId,
            });
            throw new common_1.UnauthorizedException('Authentication token is required');
        }
        try {
            const payload = jwt.verify(token, this.config.jwtSecret, {
                algorithms: [this.config.jwtAlgorithm],
            });
            request.user = payload;
            this.logger.debug('Authentication successful', 'AuthGuard', {
                userId: payload.userId,
                email: payload.email,
                path: request.path,
                requestId: request.requestId,
            });
            return true;
        }
        catch (error) {
            this.logger.warn('Authentication failed - invalid token', 'AuthGuard', {
                path: request.path,
                method: request.method,
                error: error instanceof Error ? error.message : 'unknown',
                requestId: request.requestId,
            });
            throw new common_1.UnauthorizedException('Invalid or expired authentication token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService,
        core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map