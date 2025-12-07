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
exports.RegisterUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../../domain/user/entities/user.entity");
const jwt_service_1 = require("../../../infrastructure/services/jwt.service");
const logger_service_1 = require("../../../infrastructure/observability/logger.service");
let RegisterUseCase = class RegisterUseCase {
    constructor(userRepository, passwordHasher, jwtService, logger) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
        this.logger = logger;
    }
    async execute(dto) {
        this.logger.log('Registering new user', 'RegisterUseCase', { username: dto.username, mail: dto.mail });
        const existingUserByUsername = await this.userRepository.findByUsername(dto.username);
        if (existingUserByUsername) {
            this.logger.warn('Registration failed - username already exists', 'RegisterUseCase', { username: dto.username });
            throw new common_1.ConflictException('Username already exists');
        }
        const existingUserByEmail = await this.userRepository.findByEmail(dto.mail);
        if (existingUserByEmail) {
            this.logger.warn('Registration failed - email already exists', 'RegisterUseCase', { mail: dto.mail });
            throw new common_1.ConflictException('Email already exists');
        }
        this.logger.debug('Hashing password', 'RegisterUseCase', { username: dto.username });
        const passwordHash = await this.passwordHasher.hash(dto.password);
        const user = user_entity_1.User.create(dto.username, dto.fullName, dto.mail, passwordHash);
        const savedUser = await this.userRepository.save(user);
        this.logger.log('User registered successfully', 'RegisterUseCase', {
            userId: savedUser.id,
            username: savedUser.username,
        });
        const accessToken = this.jwtService.sign({
            userId: savedUser.id,
            email: savedUser.mail,
        });
        const refreshToken = this.jwtService.signRefreshToken({
            userId: savedUser.id,
            email: savedUser.mail,
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: savedUser.id,
                username: savedUser.username,
                fullName: savedUser.fullName,
                mail: savedUser.mail,
            },
        };
    }
};
exports.RegisterUseCase = RegisterUseCase;
exports.RegisterUseCase = RegisterUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, jwt_service_1.JwtService,
        logger_service_1.AppLoggerService])
], RegisterUseCase);
//# sourceMappingURL=register.use-case.js.map