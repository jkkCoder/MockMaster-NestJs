import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@domain/user/entities/user.entity';
import { UserRepositoryPort } from '@application/auth/ports/user-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async save(user: User): Promise<User> {
    const startTime = Date.now();
    this.logger.debug('Saving user to database', 'UserRepository', {
      userId: user.id,
      username: user.username,
      mail: user.mail,
    });

    try {
      // If user.id is empty, let Prisma generate it
      const data: {
        id?: string;
        username: string;
        fullName: string;
        mail: string;
        hashedPassword: string;
      } = {
        username: user.username,
        fullName: user.fullName,
        mail: user.mail,
        hashedPassword: user.getPasswordHash(),
      };

      // Only include id if it's not empty (Prisma will generate UUID if omitted)
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
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        'Failed to save user',
        error instanceof Error ? error.stack : undefined,
        'UserRepository',
        {
          userId: user.id,
          username: user.username,
          error: error instanceof Error ? error.message : 'unknown',
        },
      );
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
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
      } else {
        this.logger.debug('User not found by username', 'UserRepository', { username, duration: `${duration}ms` });
      }

      return user ? this.toDomain(user) : null;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        'Failed to find user by username',
        error instanceof Error ? error.stack : undefined,
        'UserRepository',
        {
          username,
          error: error instanceof Error ? error.message : 'unknown',
        },
      );
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
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
      } else {
        this.logger.debug('User not found by email', 'UserRepository', { email, duration: `${duration}ms` });
      }

      return user ? this.toDomain(user) : null;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        'Failed to find user by email',
        error instanceof Error ? error.stack : undefined,
        'UserRepository',
        {
          email,
          error: error instanceof Error ? error.message : 'unknown',
        },
      );
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
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
      } else {
        this.logger.debug('User not found by ID', 'UserRepository', { userId: id, duration: `${duration}ms` });
      }

      return user ? this.toDomain(user) : null;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        'Failed to find user by ID',
        error instanceof Error ? error.stack : undefined,
        'UserRepository',
        {
          userId: id,
          error: error instanceof Error ? error.message : 'unknown',
        },
      );
      throw error;
    }
  }

  private toDomain(prismaUser: {
    id: string;
    username: string;
    fullName: string;
    mail: string;
    hashedPassword: string;
    createdAt: Date;
  }): User {
    return User.reconstitute(
      prismaUser.id,
      prismaUser.username,
      prismaUser.hashedPassword,
      prismaUser.fullName,
      prismaUser.mail,
      prismaUser.createdAt,
    );
  }
}