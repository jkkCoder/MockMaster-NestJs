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
exports.PasswordHasherService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const logger_service_1 = require("../observability/logger.service");
let PasswordHasherService = class PasswordHasherService {
    constructor(logger) {
        this.logger = logger;
        this.saltRounds = 10;
    }
    async hash(password) {
        this.logger.debug('Hashing password', 'PasswordHasherService');
        const startTime = Date.now();
        try {
            const hash = await bcrypt.hash(password, this.saltRounds);
            const duration = Date.now() - startTime;
            this.logger.debug('Password hashed successfully', 'PasswordHasherService', { duration: `${duration}ms` });
            return hash;
        }
        catch (error) {
            this.logger.error('Failed to hash password', error instanceof Error ? error.stack : undefined, 'PasswordHasherService');
            throw error;
        }
    }
    async verify(password, hash) {
        this.logger.debug('Verifying password', 'PasswordHasherService');
        const startTime = Date.now();
        try {
            const isValid = await bcrypt.compare(password, hash);
            const duration = Date.now() - startTime;
            this.logger.debug('Password verification completed', 'PasswordHasherService', {
                isValid,
                duration: `${duration}ms`,
            });
            return isValid;
        }
        catch (error) {
            this.logger.error('Failed to verify password', error instanceof Error ? error.stack : undefined, 'PasswordHasherService');
            throw error;
        }
    }
};
exports.PasswordHasherService = PasswordHasherService;
exports.PasswordHasherService = PasswordHasherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService])
], PasswordHasherService);
//# sourceMappingURL=password-hasher.service.js.map