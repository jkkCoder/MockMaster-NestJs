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
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const auth_config_1 = require("../env/base/auth.config");
const logger_service_1 = require("../observability/logger.service");
let JwtService = class JwtService {
    constructor(logger) {
        this.logger = logger;
        this.config = (0, auth_config_1.authConfig)();
    }
    sign(payload) {
        this.logger.debug('Generating JWT token', 'JwtService', { userId: payload.userId });
        const token = jwt.sign({
            userId: payload.userId,
            email: payload.email,
        }, this.config.jwtSecret, {
            algorithm: this.config.jwtAlgorithm,
            expiresIn: this.config.jwtExpiresIn,
        });
        this.logger.debug('JWT token generated successfully', 'JwtService', {
            userId: payload.userId,
            expiresIn: this.config.jwtExpiresIn,
        });
        return token;
    }
    signRefreshToken(payload) {
        this.logger.debug('Generating refresh token', 'JwtService', { userId: payload.userId });
        const token = jwt.sign({
            userId: payload.userId,
            email: payload.email,
            type: 'refresh',
        }, this.config.refreshTokenSecret, {
            algorithm: this.config.jwtAlgorithm,
            expiresIn: this.config.refreshTokenExpiresIn,
        });
        return token;
    }
    verify(token) {
        try {
            return jwt.verify(token, this.config.jwtSecret, {
                algorithms: [this.config.jwtAlgorithm],
            });
        }
        catch (error) {
            this.logger.error('JWT verification failed', error instanceof Error ? error.stack : undefined, 'JwtService', {
                error: error instanceof Error ? error.message : 'unknown',
            });
            throw new Error('Invalid token');
        }
    }
    verifyRefreshToken(token) {
        try {
            const payload = jwt.verify(token, this.config.refreshTokenSecret, {
                algorithms: [this.config.jwtAlgorithm],
            });
            if (payload.type !== 'refresh') {
                throw new Error('Invalid refresh token type');
            }
            return payload;
        }
        catch (error) {
            this.logger.error('Refresh token verification failed', error instanceof Error ? error.stack : undefined, 'JwtService', {
                error: error instanceof Error ? error.message : 'unknown',
            });
            throw new Error('Invalid refresh token');
        }
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService])
], JwtService);
//# sourceMappingURL=jwt.service.js.map