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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("../../../application/auth/dto/register.dto");
const login_dto_1 = require("../../../application/auth/dto/login.dto");
const auth_response_dto_1 = require("../../../application/auth/dto/auth-response.dto");
const register_use_case_1 = require("../../../application/auth/use-cases/register.use-case");
const logger_service_1 = require("../../../infrastructure/observability/logger.service");
const public_decorator_1 = require("../../shared/decorators/public.decorator");
const login_user_case_1 = require("../../../application/auth/use-cases/login.user-case");
let AuthController = class AuthController {
    constructor(registerUseCase, loginUseCase, logger) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.logger = logger;
    }
    async register(registerDto) {
        this.logger.log('Received registration request', 'AuthController', {
            username: registerDto.username,
            mail: registerDto.mail,
        });
        try {
            const result = await this.registerUseCase.execute(registerDto);
            this.logger.log('Registration completed successfully', 'AuthController', {
                userId: result.user.id,
                username: result.user.username,
            });
            return result;
        }
        catch (error) {
            this.logger.error('Registration failed', error instanceof Error ? error.stack : undefined, 'AuthController', {
                username: registerDto.username,
                error: error instanceof Error ? error.message : 'unknown',
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Registration failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(loginDto) {
        this.logger.log('Received login request', 'AuthController', {
            usernameOrEmail: loginDto.usernameOrEmail,
        });
        try {
            const result = await this.loginUseCase.execute(loginDto);
            this.logger.log('Login completed successfully', 'AuthController', {
                userId: result.user.id,
                username: result.user.username,
            });
            return result;
        }
        catch (error) {
            this.logger.error('Login failed', error instanceof Error ? error.stack : undefined, 'AuthController', {
                usernameOrEmail: loginDto.usernameOrEmail,
                error: error instanceof Error ? error.message : 'unknown',
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Login failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Create a new user account and receive authentication tokens',
    }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User successfully registered',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - username or email already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Login user',
        description: 'Authenticate user with username/email and password',
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User successfully authenticated',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid credentials',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [register_use_case_1.RegisterUseCase,
        login_user_case_1.LoginUseCase,
        logger_service_1.AppLoggerService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map