import { ApiProperty } from '@nestjs/swagger';

export class SectionWiseResultSummaryDto {
  @ApiProperty({ description: 'Section ID' })
  sectionId: string;

  @ApiProperty({ description: 'Section name' })
  sectionName: string;

  @ApiProperty({ description: 'Total questions in section' })
  totalQuestions: number;

  @ApiProperty({ description: 'Number of answered questions' })
  answeredQuestions: number;

  @ApiProperty({ description: 'Number of correct answers' })
  correctAnswers: number;

  @ApiProperty({ description: 'Number of incorrect answers' })
  incorrectAnswers: number;

  @ApiProperty({ description: 'Number of unanswered questions' })
  unansweredQuestions: number;

  @ApiProperty({ description: 'Total marks for section' })
  totalMarks: number;

  @ApiProperty({ description: 'Obtained marks for section' })
  obtainedMarks: number;

  @ApiProperty({ description: 'Percentage score for section' })
  percentage: number;
}

export class UserAttemptSummaryDto {
  @ApiProperty({ description: 'Attempt ID' })
  id: string;

  @ApiProperty({ description: 'Mock ID' })
  mockId: string;

  @ApiProperty({ description: 'Mock title' })
  mockTitle: string;

  @ApiProperty({ description: 'Attempt started at' })
  startedAt: Date;

  @ApiProperty({ description: 'Attempt submitted at', required: false })
  submittedAt: Date | null;

  @ApiProperty({ description: 'Score', required: false })
  score: number | null;

  @ApiProperty({ description: 'Percentage', required: false })
  percentage: number | null;

  @ApiProperty({ description: 'Attempt status' })
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

  @ApiProperty({ description: 'Section-wise results', type: [SectionWiseResultSummaryDto] })
  sectionWiseResults: SectionWiseResultSummaryDto[];
}

export class UserAttemptsResponseDto {
  @ApiProperty({ description: 'List of user attempts', type: [UserAttemptSummaryDto] })
  attempts: UserAttemptSummaryDto[];
}
