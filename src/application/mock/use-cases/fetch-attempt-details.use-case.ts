import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MockRepositoryPort } from '../ports/mock-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { AttemptDetailsResponseDto } from '../dto/attempt-details-response.dto';

@Injectable()
export class FetchAttemptDetailsUseCase {
  constructor(
    private readonly mockRepository: MockRepositoryPort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(attemptId: string, userId: string): Promise<AttemptDetailsResponseDto> {
    this.logger.log('Fetching attempt details', 'FetchAttemptDetailsUseCase', {
      attemptId,
      userId,
    });

    const attempt = await this.mockRepository.fetchAttemptWithAnswers(attemptId, userId);

    if (!attempt) {
      this.logger.warn('Attempt not found or does not belong to user', 'FetchAttemptDetailsUseCase', {
        attemptId,
        userId,
      });
      throw new NotFoundException('Attempt not found');
    }

    this.logger.log('Attempt details fetched successfully', 'FetchAttemptDetailsUseCase', {
      attemptId,
      userId,
    });

    return {
      attemptId: attempt.attemptId,
      mockId: attempt.mockId,
      title: attempt.title,
      description: attempt.description || undefined,
      duration: attempt.duration,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt || undefined,
      timeTaken: attempt.timeTaken || undefined,
      score: attempt.score || undefined,
      percentage: attempt.percentage || undefined,
      status: attempt.status,
      totalMarks: attempt.totalMarks,
      obtainedMarks: attempt.obtainedMarks,
      totalQuestions: attempt.totalQuestions,
      answeredQuestions: attempt.answeredQuestions,
      correctAnswers: attempt.correctAnswers,
      incorrectAnswers: attempt.incorrectAnswers,
      unansweredQuestions: attempt.unansweredQuestions,
      sections: attempt.sections.map((section) => ({
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
          userSelectedOptionId: question.userSelectedOptionId || undefined,
          correctOptionId: question.correctOptionId || undefined,
          isCorrect: question.isCorrect,
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
      sectionWiseResults: attempt.sectionWiseResults,
    };
  }
}
