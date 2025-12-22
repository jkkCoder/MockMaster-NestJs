import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { databaseConfig } from '@infrastructure/env/base/database.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: AppLoggerService) {
    // If DATABASE_URL is not set, build it from database config
    const dbConfig = databaseConfig();
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = `mysql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
    }

    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma client connected successfully', 'PrismaService', undefined, 'SYSTEM');
    } catch (error) {
      this.logger.error(
        'Failed to connect to database',
        error instanceof Error ? error.stack : undefined,
        'PrismaService',
        undefined,
        'SYSTEM',
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma client disconnected', 'PrismaService', undefined, 'SYSTEM');
  }
}

