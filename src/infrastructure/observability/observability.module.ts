import { Module, Global } from '@nestjs/common';
import { AppLoggerService } from './logger.service';
import { MetricsService } from './metrics.service';
import { JwtService } from '../services/jwt.service';

@Global()
@Module({
  providers: [AppLoggerService, MetricsService, JwtService],
  exports: [AppLoggerService, MetricsService, JwtService],
})
export class ObservabilityModule {}

