import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OptionDto {
  @ApiProperty({ description: 'Option label (A, B, C, D)', example: 'A' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Option text', required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ description: 'Whether option has an image', default: false })
  @IsBoolean()
  @IsOptional()
  is_image?: boolean;

  @ApiProperty({ description: 'Image URL for option', required: false })
  @IsString()
  @IsOptional()
  image_url?: string | null;

  @ApiProperty({ description: 'Whether this option is correct', default: false })
  @IsBoolean()
  is_correct: boolean;
}

export class QuestionDto {
  @ApiProperty({ description: 'Question ID from JSON', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Question number', example: 1 })
  @IsNumber()
  @IsOptional()
  question_number?: number;

  @ApiProperty({ description: 'Question text', required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ description: 'Whether question has an image', default: false })
  @IsBoolean()
  @IsOptional()
  is_image?: boolean;

  @ApiProperty({ description: 'Image URL for question', required: false })
  @IsString()
  @IsOptional()
  image_url?: string | null;

  @ApiProperty({ description: 'Marks for correct answer', default: 1 })
  @IsNumber()
  @Min(0)
  marks: number;

  @ApiProperty({ description: 'Negative marks for wrong answer', default: 0 })
  @IsNumber()
  @Min(0)
  negative_mark: number;

  @ApiProperty({ description: 'Options for this question', type: [OptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}

export class SectionDto {
  @ApiProperty({ description: 'Section ID from JSON', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Section name', example: 'Business Communication' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Sort order of section', example: 1 })
  @IsNumber()
  sort_order: number;

  @ApiProperty({ description: 'Questions in this section', type: [QuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class MockDataDto {
  @ApiProperty({ description: 'Mock title', example: 'ICSI CSEET Mock Test 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Mock description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Duration in minutes', example: 120 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Sections in the mock', type: [SectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];
}

export class CreateMockDto {
  @ApiProperty({ description: 'Mock data', type: MockDataDto })
  @ValidateNested()
  @Type(() => MockDataDto)
  mock: MockDataDto;
}