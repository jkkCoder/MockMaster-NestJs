import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { MockRepositoryPort } from '../ports/mock-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { SubmitAttemptDto } from '../dto/submit-attempt.dto';
import { SubmitAttemptResponseDto, SectionWiseResultDto } from '../dto/submit-attempt-response.dto';

@Injectable()
export class SubmitAttemptUseCase {
  constructor(
    private readonly mockRepository: MockRepositoryPort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(dto: SubmitAttemptDto, userId: string): Promise<SubmitAttemptResponseDto> {
    this.logger.log('Submitting attempt', 'SubmitAttemptUseCase', {
      attemptId: dto.attemptId,
      userId,
      answersCount: dto.answers.length,
    });

    // First check if attempt exists
    const attemptExists = await this.mockRepository.fetchAttemptById(dto.attemptId);

    if (!attemptExists) {
      this.logger.warn('Attempt not found', 'SubmitAttemptUseCase', { 
        attemptId: dto.attemptId,
        userId,
      });
      throw new NotFoundException(`Attempt with ID ${dto.attemptId} not found`);
    }

    // Check if attempt belongs to user
    if (attemptExists.userId !== userId) {
      this.logger.warn('Attempt does not belong to user', 'SubmitAttemptUseCase', {
        attemptId: dto.attemptId,
        attemptUserId: attemptExists.userId,
        requestUserId: userId,
      });
      throw new ForbiddenException('Attempt does not belong to you');
    }

    // Check attempt status
    if (attemptExists.status !== 'IN_PROGRESS') {
      this.logger.warn('Attempt already submitted', 'SubmitAttemptUseCase', {
        attemptId: dto.attemptId,
        status: attemptExists.status,
      });
      throw new ConflictException(`Attempt has already been ${attemptExists.status.toLowerCase()}`);
    }

    // Fetch attempt with mock details
    const attempt = await this.mockRepository.fetchAttemptWithMock(dto.attemptId, userId);

    if (!attempt) {
      // This shouldn't happen, but just in case
      this.logger.error('Failed to fetch attempt details', 'SubmitAttemptUseCase', {
        attemptId: dto.attemptId,
        userId,
      });
      throw new NotFoundException('Failed to fetch attempt details');
    }

    // Fetch all questions with correct answers for the mock
    const questions = await this.mockRepository.fetchQuestionsWithCorrectAnswers(attempt.mockId);

    if (questions.length === 0) {
      this.logger.warn('No questions found for mock', 'SubmitAttemptUseCase', {
        mockId: attempt.mockId,
      });
      throw new BadRequestException('Mock has no questions');
    }

    // Create a map of questionId -> question for quick lookup
    const questionMap = new Map(
      questions.map((q) => [q.id, q])
    );

    // Validate all questionIds belong to the mock
    const invalidQuestionIds = dto.answers
      .map((a) => a.questionId)
      .filter((qId) => !questionMap.has(qId));

    if (invalidQuestionIds.length > 0) {
      this.logger.warn('Invalid question IDs provided', 'SubmitAttemptUseCase', {
        invalidQuestionIds: invalidQuestionIds.join(', '),
        mockId: attempt.mockId,
      });
      throw new BadRequestException(
        `Invalid question IDs: ${invalidQuestionIds.join(', ')}`
      );
    }

    // Check for duplicate questionIds
    const questionIds = dto.answers.map((a) => a.questionId);
    const uniqueQuestionIds = new Set(questionIds);
    if (questionIds.length !== uniqueQuestionIds.size) {
      throw new BadRequestException('Duplicate question IDs found in answers');
    }

    // Calculate time taken
    const timeTaken = dto.timeTaken ?? Math.floor(
      (new Date().getTime() - attempt.startedAt.getTime()) / 1000
    );

    // Process answers and calculate scores
    const answerData: Array<{
      questionId: string;
      selectedOptionId: string | null;
      isCorrect: boolean;
      marks: number;
      sectionId: string | null;
    }> = [];

    // Process each answer
    for (const answer of dto.answers) {
      const question = questionMap.get(answer.questionId)!;
      const selectedOptionId = answer.selectedOptionId || null;
      const isCorrect = selectedOptionId === question.correctOptionId;

      let marks = 0;
      if (selectedOptionId) {
        marks = isCorrect ? question.marks : -question.negativeMark;
      }

      answerData.push({
        questionId: answer.questionId,
        selectedOptionId,
        isCorrect,
        marks,
        sectionId: question.mockSectionId,
      });
    }

    // Group answers by section for section-wise calculation
    const sectionMap = new Map<string, {
      sectionId: string;
      answers: typeof answerData;
    }>();

    // Add all questions (including unanswered) to section map
    for (const question of questions) {
      const sectionId = question.mockSectionId || 'no-section';
      if (!sectionMap.has(sectionId)) {
        sectionMap.set(sectionId, {
          sectionId,
          answers: [],
        });
      }
    }

    // Add answered questions to their sections
    for (const answer of answerData) {
      const sectionId = answer.sectionId || 'no-section';
      if (!sectionMap.has(sectionId)) {
        sectionMap.set(sectionId, {
          sectionId,
          answers: [],
        });
      }
      sectionMap.get(sectionId)!.answers.push(answer);
    }

    // Fetch section names (we need to get this from the mock)
    // For now, we'll use section IDs. In a real scenario, you might want to fetch section details
    // Calculate section-wise results
    const sectionWiseResults: SectionWiseResultDto[] = [];
    let totalScore = 0;
    let totalMarks = 0;
    let totalQuestions = questions.length;
    let answeredQuestions = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    // Create a map of answered questionIds for quick lookup (only questions with selectedOptionId)
    const answeredQuestionIds = new Set(
      dto.answers
        .filter((a) => a.selectedOptionId !== null && a.selectedOptionId !== undefined)
        .map((a) => a.questionId)
    );

    for (const [sectionId, sectionData] of sectionMap.entries()) {
      // Get all questions for this section
      const sectionQuestions = questions.filter(
        (q) => (q.mockSectionId || 'no-section') === sectionId
      );

      const sectionTotalMarks = sectionQuestions.reduce((sum, q) => sum + q.marks, 0);
      // Only count answers where selectedOptionId is not null
      const answeredAnswers = sectionData.answers.filter((a) => a.selectedOptionId !== null && a.selectedOptionId !== undefined);
      const sectionAnswered = answeredAnswers.length;
      const sectionCorrect = answeredAnswers.filter((a) => a.isCorrect).length;
      const sectionIncorrect = answeredAnswers.filter((a) => !a.isCorrect).length;
      const sectionUnanswered = sectionQuestions.length - sectionAnswered;
      const sectionObtainedMarks = sectionData.answers.reduce((sum, a) => sum + a.marks, 0);
      const sectionPercentage = sectionTotalMarks > 0
        ? (sectionObtainedMarks / sectionTotalMarks) * 100
        : 0;

      sectionWiseResults.push({
        sectionId: sectionId === 'no-section' ? '' : sectionId,
        sectionName: `Section ${sectionId}`, // You might want to fetch actual section names
        totalQuestions: sectionQuestions.length,
        answeredQuestions: sectionAnswered,
        correctAnswers: sectionCorrect,
        incorrectAnswers: sectionIncorrect,
        unansweredQuestions: sectionUnanswered,
        totalMarks: sectionTotalMarks,
        obtainedMarks: sectionObtainedMarks,
        percentage: Math.round(sectionPercentage * 100) / 100, // Round to 2 decimal places
      });

      totalScore += sectionObtainedMarks;
      totalMarks += sectionTotalMarks;
    }

    // Calculate overall statistics
    for (const question of questions) {
      const answer = answerData.find((a) => a.questionId === question.id);
      // Only count as answered if selectedOptionId is not null
      if (answer && answer.selectedOptionId !== null && answer.selectedOptionId !== undefined) {
        answeredQuestions++;
        if (answer.isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    }

    const unansweredQuestions = totalQuestions - answeredQuestions;
    const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;

    // Prepare answers for database
    const answersToCreate = answerData.map((answer) => ({
      attemptId: dto.attemptId,
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
      isCorrect: answer.isCorrect,
      answeredAt: new Date(),
    }));

    // Save answers and update attempt in a transaction
    // Note: Prisma createMany doesn't support transactions directly, so we'll do them sequentially
    // In production, you might want to use a transaction
    await this.mockRepository.createAnswers(answersToCreate);
    await this.mockRepository.updateAttemptSubmission({
      attemptId: dto.attemptId,
      submittedAt: new Date(),
      timeTaken,
      score: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
      percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
    });

    this.logger.log('Attempt submitted successfully', 'SubmitAttemptUseCase', {
      attemptId: dto.attemptId,
      score: totalScore,
      percentage,
      totalMarks,
    });

    // Fetch section names - we need to get actual section names
    // For now, we'll need to fetch them. Let me update the logic to fetch section details
    // Actually, let's fetch section details to get proper names
    const mockWithSections = await this.mockRepository.fetchMockWithQuestionsAndOptions(attempt.mockId);
    const sectionNameMap = new Map<string, string>();
    if (mockWithSections) {
      for (const section of mockWithSections.sections) {
        sectionNameMap.set(section.id, section.name);
      }
    }

    // Update section names in results
    for (const result of sectionWiseResults) {
      if (result.sectionId && sectionNameMap.has(result.sectionId)) {
        result.sectionName = sectionNameMap.get(result.sectionId)!;
      }
    }

    return {
      attemptId: dto.attemptId,
      mockId: attempt.mockId,
      title: attempt.mock.title,
      status: 'SUBMITTED',
      score: Math.round(totalScore * 100) / 100,
      percentage: Math.round(percentage * 100) / 100,
      totalMarks,
      obtainedMarks: Math.round(totalScore * 100) / 100,
      timeTaken,
      submittedAt: new Date(),
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      sectionWiseResults,
    };
  }
}
