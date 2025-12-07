import { ApiProperty } from '@nestjs/swagger';

export class MockResponseDto {
  @ApiProperty({ description: 'Created mock ID' })
  id: string;

  @ApiProperty({ description: 'Mock title' })
  title: string;

  @ApiProperty({ description: 'Mock description', required: false })
  description?: string;

  @ApiProperty({ description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Number of sections created' })
  sectionsCount: number;

  @ApiProperty({ description: 'Total number of questions created' })
  questionsCount: number;
}