import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { HttpInterceptor } from './shared/interceptors/http.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AuthGuard } from './shared/guards/auth.guard';
// Environment config is loaded at startup via base/index.ts
// ConfigModule is not needed as we use centralized env config

@Module({
  imports: [
    ObservabilityModule,
  ],
  controllers: [],
  providers: [
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
  ],
})
export class AppModule {}

