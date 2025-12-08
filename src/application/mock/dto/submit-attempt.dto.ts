import { IsString, IsArray, IsOptional, IsNumber, ValidateNested, IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerSubmissionDto {
  @ApiProperty({ description: 'Question ID', example: 'uuid-here' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @ApiProperty({ 
    description: 'Selected option ID, or null if not answered', 
    example: 'uuid-here',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  selectedOptionId?: string | null;
}

export class SubmitAttemptDto {
  @ApiProperty({ description: 'Attempt ID from start-attempt', example: 'uuid-here' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  attemptId: string;

  @ApiProperty({ 
    description: 'Array of answers submitted by user', 
    type: [AnswerSubmissionDto] 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerSubmissionDto)
  answers: AnswerSubmissionDto[];

  @ApiProperty({ 
    description: 'Time taken in seconds (optional, will be calculated if not provided)', 
    example: 3600,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  timeTaken?: number;
}
