import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  usernameOrEmail!: string;

  @ApiProperty({
    description: 'Password',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
