import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    constructor(logger: AppLoggerService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
