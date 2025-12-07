import { ApiProperty } from '@nestjs/swagger';

export class SectionResponseDto {
  @ApiProperty({ description: 'Section ID' })
  id: string;

  @ApiProperty({ description: 'Section name', example: 'Business Communication' })
  name: string;

  @ApiProperty({ description: 'Sort order of section', example: 1 })
  sortOrder: number;
}

export class MockWithSectionsDto {
  @ApiProperty({ description: 'Mock ID' })
  id: string;

  @ApiProperty({ description: 'Mock title' })
  title: string;

  @ApiProperty({ description: 'Mock description', required: false })
  description?: string;

  @ApiProperty({ description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Whether mock is active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Sections in this mock', type: [SectionResponseDto] })
  sections: SectionResponseDto[];
}

export class FetchMocksResponseDto {
  @ApiProperty({ description: 'List of mocks with their sections', type: [MockWithSectionsDto] })
  mocks: MockWithSectionsDto[];
}