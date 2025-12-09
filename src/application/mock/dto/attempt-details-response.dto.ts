import { ApiProperty } from '@nestjs/swagger';
import { SectionWiseResultSummaryDto } from './user-attempts-response.dto';

export class OptionWithAnswerDto {
  @ApiProperty({ description: 'Option ID' })
  id: string;

  @ApiProperty({ description: 'Option label' })
  label: string;

  @ApiProperty({ description: 'Option text', required: false })
  text?: string;

  @ApiProperty({ description: 'Option image URL', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Sort order' })
  sortOrder: number;

  @ApiProperty({ description: 'Whether this is the correct answer' })
  isCorrect: boolean;
}

export class QuestionWithUserAnswerDto {
  @ApiProperty({ description: 'Question ID' })
  id: string;

  @ApiProperty({ description: 'Question text', required: false })
  text?: string;

  @ApiProperty({ description: 'Question image URL', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Marks for correct answer' })
  marks: number;

  @ApiProperty({ description: 'Negative marks for wrong answer' })
  negativeMark: number;

  @ApiProperty({ description: 'Sort order' })
  sortOrder: number;

  @ApiProperty({ description: 'Section ID', required: false })
  sectionId?: string;

  @ApiProperty({ description: 'User selected option ID', required: false })
  userSelectedOptionId?: string | null;

  @ApiProperty({ description: 'Correct option ID', required: false })
  correctOptionId?: string | null;

  @ApiProperty({ description: 'Whether user answered correctly' })
  isCorrect: boolean;

  @ApiProperty({ description: 'Options', type: [OptionWithAnswerDto] })
  options: OptionWithAnswerDto[];
}

export class SectionWithUserAnswersDto {
  @ApiProperty({ description: 'Section ID' })
  id: string;

  @ApiProperty({ description: 'Section name' })
  name: string;

  @ApiProperty({ description: 'Sort order' })
  sortOrder: number;

  @ApiProperty({ description: 'Questions with user answers', type: [QuestionWithUserAnswerDto] })
  questions: QuestionWithUserAnswerDto[];
}

export class AttemptDetailsResponseDto {
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

  @ApiProperty({ description: 'Started at' })
  startedAt: Date;

  @ApiProperty({ description: 'Submitted at', required: false })
  submittedAt?: Date | null;

  @ApiProperty({ description: 'Time taken in seconds', required: false })
  timeTaken?: number | null;

  @ApiProperty({ description: 'Score', required: false })
  score?: number | null;

  @ApiProperty({ description: 'Percentage', required: false })
  percentage?: number | null;

  @ApiProperty({ description: 'Status' })
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED';

  @ApiProperty({ description: 'Total marks' })
  totalMarks: number;

  @ApiProperty({ description: 'Obtained marks' })
  obtainedMarks: number;

  @ApiProperty({ description: 'Total questions' })
  totalQuestions: number;

  @ApiProperty({ description: 'Answered questions' })
  answeredQuestions: number;

  @ApiProperty({ description: 'Correct answers' })
  correctAnswers: number;

  @ApiProperty({ description: 'Incorrect answers' })
  incorrectAnswers: number;

  @ApiProperty({ description: 'Unanswered questions' })
  unansweredQuestions: number;

  @ApiProperty({ description: 'Sections with questions and answers', type: [SectionWithUserAnswersDto] })
  sections: SectionWithUserAnswersDto[];

  @ApiProperty({ description: 'Section-wise results', type: [SectionWiseResultSummaryDto] })
  sectionWiseResults: SectionWiseResultSummaryDto[];
}
