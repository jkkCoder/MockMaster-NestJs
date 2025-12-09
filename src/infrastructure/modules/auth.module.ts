import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ObservabilityModule } from '../observability/observability.module';
import { UserRepository } from '../database/repositories/user.repository';
import { PasswordHasherService } from '../services/password-hasher.service';
import { JwtService } from '../services/jwt.service';
import { USER_REPOSITORY_PORT } from '@application/auth/ports/user-repository.port';
import { PASSWORD_HASHER_PORT } from '@application/shared/ports/password-hasher.port';

@Module({
  imports: [DatabaseModule, ObservabilityModule],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserRepository,
    },
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: PasswordHasherService,
    },
    JwtService,
  ],
  exports: [USER_REPOSITORY_PORT, PASSWORD_HASHER_PORT, JwtService],
})
export class AuthInfrastructureModule {}


