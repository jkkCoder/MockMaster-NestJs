"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const observability_module_1 = require("../infrastructure/observability/observability.module");
const database_module_1 = require("../infrastructure/database/database.module");
const auth_module_1 = require("../infrastructure/modules/auth.module");
const logging_interceptor_1 = require("./shared/interceptors/logging.interceptor");
const http_interceptor_1 = require("./shared/interceptors/http.interceptor");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const auth_guard_1 = require("./shared/guards/auth.guard");
const auth_controller_1 = require("./auth/controllers/auth.controller");
const register_use_case_1 = require("../application/auth/use-cases/register.use-case");
const user_repository_port_1 = require("../application/auth/ports/user-repository.port");
const password_hasher_port_1 = require("../application/shared/ports/password-hasher.port");
const jwt_service_1 = require("../infrastructure/services/jwt.service");
const logger_service_1 = require("../infrastructure/observability/logger.service");
const login_user_case_1 = require("../application/auth/use-cases/login.user-case");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            observability_module_1.ObservabilityModule,
            auth_module_1.AuthInfrastructureModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            {
                provide: register_use_case_1.RegisterUseCase,
                useFactory: (userRepository, passwordHasher, jwtService, logger) => {
                    return new register_use_case_1.RegisterUseCase(userRepository, passwordHasher, jwtService, logger);
                },
                inject: [user_repository_port_1.USER_REPOSITORY_PORT, password_hasher_port_1.PASSWORD_HASHER_PORT, jwt_service_1.JwtService, logger_service_1.AppLoggerService],
            },
            {
                provide: login_user_case_1.LoginUseCase,
                useFactory: (userRepository, passwordHasher, jwtService, logger) => {
                    return new login_user_case_1.LoginUseCase(userRepository, passwordHasher, jwtService, logger);
                },
                inject: [user_repository_port_1.USER_REPOSITORY_PORT, password_hasher_port_1.PASSWORD_HASHER_PORT, jwt_service_1.JwtService, logger_service_1.AppLoggerService],
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: http_interceptor_1.HttpInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map