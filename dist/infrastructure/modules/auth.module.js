"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthInfrastructureModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const observability_module_1 = require("../observability/observability.module");
const user_repository_1 = require("../database/repositories/user.repository");
const password_hasher_service_1 = require("../services/password-hasher.service");
const jwt_service_1 = require("../services/jwt.service");
const user_repository_port_1 = require("../../application/auth/ports/user-repository.port");
const password_hasher_port_1 = require("../../application/shared/ports/password-hasher.port");
let AuthInfrastructureModule = class AuthInfrastructureModule {
};
exports.AuthInfrastructureModule = AuthInfrastructureModule;
exports.AuthInfrastructureModule = AuthInfrastructureModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, observability_module_1.ObservabilityModule],
        providers: [
            {
                provide: user_repository_port_1.USER_REPOSITORY_PORT,
                useClass: user_repository_1.UserRepository,
            },
            {
                provide: password_hasher_port_1.PASSWORD_HASHER_PORT,
                useClass: password_hasher_service_1.PasswordHasherService,
            },
            jwt_service_1.JwtService,
        ],
        exports: [user_repository_port_1.USER_REPOSITORY_PORT, password_hasher_port_1.PASSWORD_HASHER_PORT, jwt_service_1.JwtService],
    })
], AuthInfrastructureModule);
//# sourceMappingURL=auth.module.js.map