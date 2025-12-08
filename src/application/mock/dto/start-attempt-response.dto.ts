import { ApiProperty } from '@nestjs/swagger';

export class OptionResponseDto {
  @ApiProperty({ description: 'Option ID' })
  id: string;

  @ApiProperty({ description: 'Option label (A, B, C, D)', example: 'A' })
  label: string;

  @ApiProperty({ description: 'Option text', required: false })
  text?: string;

  @ApiProperty({ description: 'Image URL for option', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Sort order of option' })
  sortOrder: number;
}

export class QuestionResponseDto {
  @ApiProperty({ description: 'Question ID' })
  id: string;

  @ApiProperty({ description: 'Question text', required: false })
  text?: string;

  @ApiProperty({ description: 'Image URL for question', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Marks for correct answer' })
  marks: number;

  @ApiProperty({ description: 'Negative marks for wrong answer' })
  negativeMark: number;

  @ApiProperty({ description: 'Sort order of question' })
  sortOrder: number;

  @ApiProperty({ description: 'Section ID this question belongs to', required: false })
  sectionId?: string;

  @ApiProperty({ description: 'Options for this question', type: [OptionResponseDto] })
  options: OptionResponseDto[];
}

export class SectionWithQuestionsDto {
  @ApiProperty({ description: 'Section ID' })
  id: string;

  @ApiProperty({ description: 'Section name' })
  name: string;

  @ApiProperty({ description: 'Sort order of section' })
  sortOrder: number;

  @ApiProperty({ description: 'Questions in this section', type: [QuestionResponseDto] })
  questions: QuestionResponseDto[];
}

export class StartAttemptResponseDto {
  @ApiProperty({ description: 'Attempt ID' })
  attemptId: string;

  @ApiProperty({ description: 'Mock ID' })
  mockId: string;

  @ApiProperty({ description: 'Mock title' })
  title: string;

  @ApiProperty({ description: 'Mock description', required: false })
  description?: string;

  @ApiProperty({ description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Attempt started at timestamp' })
  startedAt: Date;

  @ApiProperty({ description: 'Sections with questions and options', type: [SectionWithQuestionsDto] })
  sections: SectionWithQuestionsDto[];
}