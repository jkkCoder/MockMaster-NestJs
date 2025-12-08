import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MockRepositoryPort } from '../ports/mock-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { StartAttemptResponseDto } from '../dto/start-attempt-response.dto';
import { StartAttemptDto } from '../dto/start-attemp.dt';

@Injectable()
export class StartAttemptUseCase {
  constructor(
    private readonly mockRepository: MockRepositoryPort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(dto: StartAttemptDto, userId: string): Promise<StartAttemptResponseDto> {
    this.logger.log('Starting attempt', 'StartAttemptUseCase', {
      mockId: dto.mockId,
      userId,
    });

    // Fetch mock with questions and options
    const mock = await this.mockRepository.fetchMockWithQuestionsAndOptions(dto.mockId);

    if (!mock) {
      this.logger.warn('Mock not found', 'StartAttemptUseCase', { mockId: dto.mockId });
      throw new NotFoundException('Mock not found');
    }

    if (!mock.sections || mock.sections.length === 0) {
      this.logger.warn('Mock has no sections', 'StartAttemptUseCase', { mockId: dto.mockId });
      throw new BadRequestException('Mock has no sections');
    }

    // Create attempt
    const attempt = await this.mockRepository.createAttempt({
      userId,
      mockId: dto.mockId,
    });

    this.logger.log('Attempt created successfully', 'StartAttemptUseCase', {
      attemptId: attempt.id,
      mockId: dto.mockId,
      userId,
    });

    // Map to response DTO
    return {
      attemptId: attempt.id,
      mockId: mock.id,
      title: mock.title,
      description: mock.description || undefined,
      duration: mock.duration,
      startedAt: attempt.startedAt,
      sections: mock.sections.map((section) => ({
        id: section.id,
        name: section.name,
        sortOrder: section.sortOrder,
        questions: section.questions.map((question) => ({
          id: question.id,
          text: question.text || undefined,
          imageUrl: question.imageUrl || undefined,
          marks: question.marks,
          negativeMark: question.negativeMark,
          sortOrder: question.sortOrder,
          sectionId: question.mockSectionId || undefined,
          options: question.options.map((option) => ({
            id: option.id,
            label: option.label,
            text: option.text || undefined,
            imageUrl: option.imageUrl || undefined,
            sortOrder: option.sortOrder,
          })),
        })),
      })),
    };
  }
}