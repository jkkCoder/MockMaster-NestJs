import { Injectable } from '@nestjs/common';
import { CreateMockDto } from '../dto/create-mock.dto';
import { MockRepositoryPort } from '../ports/mock-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { MockResponseDto } from '../dto/create-mock-response.dto';

@Injectable()
export class CreateMockUseCase {
  constructor(
    private readonly mockRepository: MockRepositoryPort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(dto: CreateMockDto): Promise<MockResponseDto> {
    this.logger.log('Creating mock', 'CreateMockUseCase', {
      title: dto.mock.title,
      sectionsCount: dto.mock.sections.length,
    });

    // Create mock
    const mock = await this.mockRepository.createMock({
      title: dto.mock.title,
      description: dto.mock.description,
      duration: dto.mock.duration,
      isActive: true,
    });

    let totalQuestions = 0;

    // Process sections
    for (const section of dto.mock.sections) {
      // Create section
      const createdSection = await this.mockRepository.createSection({
        mockId: mock.id,
        name: section.name,
        sortOrder: section.sort_order,
      });

      // Process questions in this section
      for (let qIndex = 0; qIndex < section.questions.length; qIndex++) {
        const question = section.questions[qIndex];
        
        // Create question
        const createdQuestion = await this.mockRepository.createQuestion({
          mockId: mock.id,
          mockSectionId: createdSection.id,
          text: question.text,
          imageUrl: question.image_url || undefined,
          marks: question.marks,
          negativeMark: question.negative_mark,
          sortOrder: qIndex + 1, // Serial-wise sort order
        });

        totalQuestions++;

        // Process options for this question
        for (let oIndex = 0; oIndex < question.options.length; oIndex++) {
          const option = question.options[oIndex];
          
          await this.mockRepository.createOption({
            questionId: createdQuestion.id,
            label: option.label,
            text: option.text,
            imageUrl: option.image_url || undefined,
            isCorrect: option.is_correct,
            sortOrder: oIndex + 1, // Serial-wise sort order
          });
        }
      }
    }

    this.logger.log('Mock created successfully', 'CreateMockUseCase', {
      mockId: mock.id,
      sectionsCount: dto.mock.sections.length,
      questionsCount: totalQuestions,
    });

    return {
      id: mock.id,
      title: mock.title,
      description: mock.description || undefined,
      duration: mock.duration,
      sectionsCount: dto.mock.sections.length,
      questionsCount: totalQuestions,
    };
  }
}