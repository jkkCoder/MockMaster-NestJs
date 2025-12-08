import { ApiProperty } from '@nestjs/swagger';

export class SectionWiseResultDto {
  @ApiProperty({ description: 'Section ID' })
  sectionId: string;

  @ApiProperty({ description: 'Section name' })
  sectionName: string;

  @ApiProperty({ description: 'Total questions in this section' })
  totalQuestions: number;

  @ApiProperty({ description: 'Number of questions answered' })
  answeredQuestions: number;

  @ApiProperty({ description: 'Number of correct answers' })
  correctAnswers: number;

  @ApiProperty({ description: 'Number of incorrect answers' })
  incorrectAnswers: number;

  @ApiProperty({ description: 'Number of unanswered questions' })
  unansweredQuestions: number;

  @ApiProperty({ description: 'Total possible marks for this section' })
  totalMarks: number;

  @ApiProperty({ description: 'Marks obtained in this section' })
  obtainedMarks: number;

  @ApiProperty({ description: 'Percentage score for this section' })
  percentage: number;
}

export class SubmitAttemptResponseDto {
  @ApiProperty({ description: 'Attempt ID' })
  attemptId: string;

  @ApiProperty({ description: 'Mock ID' })
  mockId: string;

  @ApiProperty({ description: 'Mock title' })
  title: string;

  @ApiProperty({ description: 'Submission status', enum: ['SUBMITTED'] })
  status: 'SUBMITTED';

  @ApiProperty({ description: 'Overall score obtained' })
  score: number;

  @ApiProperty({ description: 'Overall percentage score' })
  percentage: number;

  @ApiProperty({ description: 'Total possible marks for the entire mock' })
  totalMarks: number;

  @ApiProperty({ description: 'Marks obtained (same as score)' })
  obtainedMarks: number;

  @ApiProperty({ description: 'Time taken in seconds' })
  timeTaken: number;

  @ApiProperty({ description: 'Submission timestamp' })
  submittedAt: Date;

  @ApiProperty({ description: 'Total number of questions in the mock' })
  totalQuestions: number;

  @ApiProperty({ description: 'Number of questions answered' })
  answeredQuestions: number;

  @ApiProperty({ description: 'Number of correct answers overall' })
  correctAnswers: number;

  @ApiProperty({ description: 'Number of incorrect answers overall' })
  incorrectAnswers: number;

  @ApiProperty({ description: 'Number of unanswered questions' })
  unansweredQuestions: number;

  @ApiProperty({ 
    description: 'Section-wise score breakdown', 
    type: [SectionWiseResultDto] 
  })
  sectionWiseResults: SectionWiseResultDto[];
}
