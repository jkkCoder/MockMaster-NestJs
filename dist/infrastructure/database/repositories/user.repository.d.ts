import { PrismaService } from '../prisma.service';
import { User } from '@domain/user/entities/user.entity';
import { UserRepositoryPort } from '@application/auth/ports/user-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
export declare class UserRepository implements UserRepositoryPort {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService, logger: AppLoggerService);
    save(user: User): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    private toDomain;
}
