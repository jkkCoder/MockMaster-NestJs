import { Injectable } from '@nestjs/common';
import { MockRepositoryPort } from '../ports/mock-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { UserAttemptsResponseDto } from '../dto/user-attempts-response.dto';

@Injectable()
export class FetchUserAttemptsUseCase {
  constructor(
    private readonly mockRepository: MockRepositoryPort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(userId: string): Promise<UserAttemptsResponseDto> {
    this.logger.log('Fetching user attempts', 'FetchUserAttemptsUseCase', {
      userId,
    });

    const attempts = await this.mockRepository.fetchUserAttempts(userId);

    this.logger.log('User attempts fetched successfully', 'FetchUserAttemptsUseCase', {
      userId,
      attemptsCount: attempts.length,
    });

    return {
      attempts,
    };
  }
}
