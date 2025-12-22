import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { authConfig } from '../env/base/auth.config';
import { AppLoggerService } from '../observability/logger.service';
import { JwtPayload } from '@interface/shared/guards/auth.guard';

@Injectable()
export class JwtService {
  private readonly config = authConfig();

  constructor(private readonly logger: AppLoggerService) {}

  /**
   * Generate JWT access token
   */
  sign(payload: { userId: string; email: string }, userName?: string): string {
    this.logger.debug('Generating JWT token', 'JwtService', { userId: payload.userId }, userName || payload.userId);
    
    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
      },
      this.config.jwtSecret,
      {
        algorithm: this.config.jwtAlgorithm as jwt.Algorithm,
        expiresIn: this.config.jwtExpiresIn,
      } as jwt.SignOptions,
    );

    this.logger.debug('JWT token generated successfully', 'JwtService', {
      userId: payload.userId,
      expiresIn: this.config.jwtExpiresIn,
    }, userName || payload.userId);

    return token;
  }

  /**
   * Generate refresh token
   */
  signRefreshToken(payload: { userId: string; email: string }, userName?: string): string {
    this.logger.debug('Generating refresh token', 'JwtService', { userId: payload.userId }, userName || payload.userId);

    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        type: 'refresh',
      },
      this.config.refreshTokenSecret,
      {
        algorithm: this.config.jwtAlgorithm as jwt.Algorithm,
        expiresIn: this.config.refreshTokenExpiresIn,
      } as jwt.SignOptions,
    );

    return token;
  }

  /**
   * Verify JWT access token
   */
  verify(token: string, userName?: string): JwtPayload {
    try {
      return jwt.verify(token, this.config.jwtSecret, {
        algorithms: [this.config.jwtAlgorithm as jwt.Algorithm],
      }) as JwtPayload;
    } catch (error) {
      this.logger.error('JWT verification failed', error instanceof Error ? error.stack : undefined, 'JwtService', {
        error: error instanceof Error ? error.message : 'unknown',
      }, userName || 'SYSTEM');
      throw new Error('Invalid token');
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string, userName?: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.config.refreshTokenSecret, {
        algorithms: [this.config.jwtAlgorithm as jwt.Algorithm],
      }) as JwtPayload & { type?: string };

      if (payload.type !== 'refresh') {
        throw new Error('Invalid refresh token type');
      }

      return payload;
    } catch (error) {
      this.logger.error('Refresh token verification failed', error instanceof Error ? error.stack : undefined, 'JwtService', {
        error: error instanceof Error ? error.message : 'unknown',
      }, userName || 'SYSTEM');
      throw new Error('Invalid refresh token');
    }
  }
}

