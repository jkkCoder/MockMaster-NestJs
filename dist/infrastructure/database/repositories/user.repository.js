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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const user_entity_1 = require("../../../domain/user/entities/user.entity");
const logger_service_1 = require("../../observability/logger.service");
let UserRepository = class UserRepository {
    constructor(prisma, logger) {
        this.prisma = prisma;
        this.logger = logger;
    }
    async save(user) {
        const startTime = Date.now();
        this.logger.debug('Saving user to database', 'UserRepository', {
            userId: user.id,
            username: user.username,
            mail: user.mail,
        });
        try {
            const data = {
                username: user.username,
                fullName: user.fullName,
                mail: user.mail,
                hashedPassword: user.getPasswordHash(),
            };
            if (user.id) {
                data.id = user.id;
            }
            const saved = await this.prisma.user.create({ data });
            const duration = Date.now() - startTime;
            this.logger.log('User saved successfully', 'UserRepository', {
                userId: saved.id,
                username: saved.username,
                duration: `${duration}ms`,
            });
            return this.toDomain(saved);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error('Failed to save user', error instanceof Error ? error.stack : undefined, 'UserRepository', {
                userId: user.id,
                username: user.username,
                error: error instanceof Error ? error.message : 'unknown',
            });
            throw error;
        }
    }
    async findByUsername(username) {
        const startTime = Date.now();
        this.logger.debug('Finding user by username', 'UserRepository', { username });
        try {
            const user = await this.prisma.user.findUnique({
                where: { username },
            });
            const duration = Date.now() - startTime;
            if (user) {
                this.logger.debug('User found by username', 'UserRepository', {
                    userId: user.id,
                    username,
                    duration: `${duration}ms`,
                });
            }
            else {
                this.logger.debug('User not found by username', 'UserRepository', { username, duration: `${duration}ms` });
            }
            return user ? this.toDomain(user) : null;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error('Failed to find user by username', error instanceof Error ? error.stack : undefined, 'UserRepository', {
                username,
                error: error instanceof Error ? error.message : 'unknown',
            });
            throw error;
        }
    }
    async findByEmail(email) {
        const startTime = Date.now();
        this.logger.debug('Finding user by email', 'UserRepository', { email });
        try {
            const user = await this.prisma.user.findUnique({
                where: { mail: email },
            });
            const duration = Date.now() - startTime;
            if (user) {
                this.logger.debug('User found by email', 'UserRepository', {
                    userId: user.id,
                    email,
                    duration: `${duration}ms`,
                });
            }
            else {
                this.logger.debug('User not found by email', 'UserRepository', { email, duration: `${duration}ms` });
            }
            return user ? this.toDomain(user) : null;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error('Failed to find user by email', error instanceof Error ? error.stack : undefined, 'UserRepository', {
                email,
                error: error instanceof Error ? error.message : 'unknown',
            });
            throw error;
        }
    }
    async findById(id) {
        const startTime = Date.now();
        this.logger.debug('Finding user by ID', 'UserRepository', { userId: id });
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
            });
            const duration = Date.now() - startTime;
            if (user) {
                this.logger.debug('User found by ID', 'UserRepository', {
                    userId: id,
                    username: user.username,
                    duration: `${duration}ms`,
                });
            }
            else {
                this.logger.debug('User not found by ID', 'UserRepository', { userId: id, duration: `${duration}ms` });
            }
            return user ? this.toDomain(user) : null;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error('Failed to find user by ID', error instanceof Error ? error.stack : undefined, 'UserRepository', {
                userId: id,
                error: error instanceof Error ? error.message : 'unknown',
            });
            throw error;
        }
    }
    toDomain(prismaUser) {
        return user_entity_1.User.reconstitute(prismaUser.id, prismaUser.username, prismaUser.hashedPassword, prismaUser.fullName, prismaUser.mail, prismaUser.createdAt);
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logger_service_1.AppLoggerService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map