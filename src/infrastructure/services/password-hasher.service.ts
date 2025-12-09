import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PasswordHasherPort } from '@application/shared/ports/password-hasher.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';

@Injectable()
export class PasswordHasherService implements PasswordHasherPort {
  private readonly saltRounds = 10;

  constructor(private readonly logger: AppLoggerService) {}

  async hash(password: string): Promise<string> {
    this.logger.debug('Hashing password', 'PasswordHasherService');
    const startTime = Date.now();

    try {
      const hash = await bcrypt.hash(password, this.saltRounds);
      const duration = Date.now() - startTime;
      this.logger.debug('Password hashed successfully', 'PasswordHasherService', { duration: `${duration}ms` });
      return hash;
    } catch (error) {
      this.logger.error('Failed to hash password', error instanceof Error ? error.stack : undefined, 'PasswordHasherService');
      throw error;
    }
  }

  async verify(password: string, hash: string): Promise<boolean> {
    this.logger.debug('Verifying password', 'PasswordHasherService');
    const startTime = Date.now();

    try {
      const isValid = await bcrypt.compare(password, hash);
      const duration = Date.now() - startTime;
      this.logger.debug('Password verification completed', 'PasswordHasherService', {
        isValid,
        duration: `${duration}ms`,
      });
      return isValid;
    } catch (error) {
      this.logger.error('Failed to verify password', error instanceof Error ? error.stack : undefined, 'PasswordHasherService');
      throw error;
    }
  }
}
