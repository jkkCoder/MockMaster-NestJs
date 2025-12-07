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
exports.LoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../../../infrastructure/services/jwt.service");
const logger_service_1 = require("../../../infrastructure/observability/logger.service");
let LoginUseCase = class LoginUseCase {
    constructor(userRepository, passwordHasher, jwtService, logger) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
        this.logger = logger;
    }
    async execute(dto) {
        this.logger.log('Login attempt', 'LoginUseCase', { usernameOrEmail: dto.usernameOrEmail });
        let user = await this.userRepository.findByUsername(dto.usernameOrEmail);
        console.log("user by userName", user);
        if (!user) {
            user = await this.userRepository.findByEmail(dto.usernameOrEmail);
            console.log("user by userName", user);
        }
        if (!user) {
            this.logger.warn('Login failed - user not found', 'LoginUseCase', { usernameOrEmail: dto.usernameOrEmail });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.debug('Verifying password', 'LoginUseCase', { userId: user.id });
        const isPasswordValid = await this.passwordHasher.verify(dto.password, user.getPasswordHash());
        if (!isPasswordValid) {
            this.logger.warn('Login failed - invalid password', 'LoginUseCase', { userId: user.id });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.log('User logged in successfully', 'LoginUseCase', {
            userId: user.id,
            username: user.username,
        });
        const accessToken = this.jwtService.sign({
            userId: user.id,
            email: user.mail,
        });
        const refreshToken = this.jwtService.signRefreshToken({
            userId: user.id,
            email: user.mail,
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                mail: user.mail,
            },
        };
    }
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, jwt_service_1.JwtService,
        logger_service_1.AppLoggerService])
], LoginUseCase);
//# sourceMappingURL=login.user-case.js.map