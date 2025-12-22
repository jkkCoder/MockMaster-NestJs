import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MockRepositoryPort } from '../ports/mock-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { ViewAnswersResponseDto } from '../dto/view-answers-response.dto';

@Injectable()
export class ViewAnswersUseCase {
  constructor(
    private readonly mockRepository: MockRepositoryPort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(mockId: string, userName?: string): Promise<ViewAnswersResponseDto> {
    this.logger.log('Viewing answers for mock', 'ViewAnswersUseCase', {
      mockId,
    }, userName || 'SYSTEM');

    // Fetch mock with questions and options including correct answers
    const mock = await this.mockRepository.fetchMockWithQuestionsAndOptionsWithAnswers(mockId);

    if (!mock) {
      this.logger.warn('Mock not found', 'ViewAnswersUseCase', { mockId }, userName || 'SYSTEM');
      throw new NotFoundException('Mock not found');
    }

    if (!mock.sections || mock.sections.length === 0) {
      this.logger.warn('Mock has no sections', 'ViewAnswersUseCase', { mockId }, userName || 'SYSTEM');
      throw new BadRequestException('Mock has no sections');
    }

    // Map to response DTO
    return {
      mockId: mock.id,
      title: mock.title,
      description: mock.description || undefined,
      duration: mock.duration,
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
            isCorrect: option.isCorrect,
          })),
        })),
      })),
    };
  }
}
