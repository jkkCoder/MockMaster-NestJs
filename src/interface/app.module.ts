import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { AuthInfrastructureModule } from '@infrastructure/modules/auth.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { HttpInterceptor } from './shared/interceptors/http.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthController } from './auth/controllers/auth.controller';
import { RegisterUseCase } from '@application/auth/use-cases/register.use-case';
import { UserRepositoryPort, USER_REPOSITORY_PORT } from '@application/auth/ports/user-repository.port';
import { PasswordHasherPort, PASSWORD_HASHER_PORT } from '@application/shared/ports/password-hasher.port';
import { JwtService } from '@infrastructure/services/jwt.service';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { LoginUseCase } from '@application/auth/use-cases/login.user-case';
import { MockInfrastructureModule } from '@infrastructure/modules/mock.module';
import { MockController } from './mock/controllers/mock.controller';
import { MockRepositoryPort, MOCK_REPOSITORY_PORT } from '@application/mock/ports/mock-repository.port';
import { CreateMockUseCase } from '@application/mock/use-cases/create-mock.user-case';
import { FetchMocksUseCase } from '@application/mock/use-cases/fetch-mock.user-case';
import { StartAttemptUseCase } from '@application/mock/use-cases/start-attempt.use-case';
import { SubmitAttemptUseCase } from '@application/mock/use-cases/submit-attempt.use-case';

@Module({
  imports: [
    DatabaseModule,
    ObservabilityModule,
    AuthInfrastructureModule,
    MockInfrastructureModule, // Add this
  ],
  controllers: [
    AuthController,
    MockController, // Add this
  ],
  providers: [
    // Auth use cases
    {
      provide: RegisterUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordHasher: PasswordHasherPort,
        jwtService: JwtService,
        logger: AppLoggerService,
      ) => {
        return new RegisterUseCase(userRepository, passwordHasher, jwtService, logger);
      },
      inject: [USER_REPOSITORY_PORT, PASSWORD_HASHER_PORT, JwtService, AppLoggerService],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordHasher: PasswordHasherPort,
        jwtService: JwtService,
        logger: AppLoggerService,
      ) => {
        return new LoginUseCase(userRepository, passwordHasher, jwtService, logger);
      },
      inject: [USER_REPOSITORY_PORT, PASSWORD_HASHER_PORT, JwtService, AppLoggerService],
    },
    // Global providers
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: CreateMockUseCase,
      useFactory: (
        mockRepository: MockRepositoryPort,
        logger: AppLoggerService,
      ) => {
        return new CreateMockUseCase(mockRepository, logger);
      },
      inject: [MOCK_REPOSITORY_PORT, AppLoggerService],
    },
    {
      provide: FetchMocksUseCase,
      useFactory: (
        mockRepository: MockRepositoryPort,
        logger: AppLoggerService,
      ) => {
        return new FetchMocksUseCase(mockRepository, logger);
      },
      inject: [MOCK_REPOSITORY_PORT, AppLoggerService],
    },
    {
      provide: StartAttemptUseCase,
      useFactory: (
        mockRepository: MockRepositoryPort,
        logger: AppLoggerService,
      ) => {
        return new StartAttemptUseCase(mockRepository, logger);
      },
      inject: [MOCK_REPOSITORY_PORT, AppLoggerService],
    },
    {
      provide: SubmitAttemptUseCase,
      useFactory: (
        mockRepository: MockRepositoryPort,
        logger: AppLoggerService,
      ) => {
        return new SubmitAttemptUseCase(mockRepository, logger);
      },
      inject: [MOCK_REPOSITORY_PORT, AppLoggerService],
    },
  ],
})
export class AppModule {}