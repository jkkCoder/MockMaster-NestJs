import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartAttemptDto {
  @ApiProperty({ description: 'Mock ID to start attempt for', example: 'uuid-here' })
  @IsString()
  @IsNotEmpty()
  mockId: string;
}