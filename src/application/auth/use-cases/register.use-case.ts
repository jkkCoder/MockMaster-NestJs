import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@domain/user/entities/user.entity';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { PasswordHasherPort } from '../../shared/ports/password-hasher.port';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtService } from '@infrastructure/services/jwt.service';
import { AppLoggerService } from '@infrastructure/observability/logger.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly jwtService: JwtService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log('Registering new user', 'RegisterUseCase', { username: dto.username, mail: dto.mail });

    // Check if username already exists
    const existingUserByUsername = await this.userRepository.findByUsername(dto.username);
    if (existingUserByUsername) {
      this.logger.warn('Registration failed - username already exists', 'RegisterUseCase', { username: dto.username });
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(dto.mail);
    if (existingUserByEmail) {
      this.logger.warn('Registration failed - email already exists', 'RegisterUseCase', { mail: dto.mail });
      throw new ConflictException('Email already exists');
    }

    // Hash password
    this.logger.debug('Hashing password', 'RegisterUseCase', { username: dto.username });
    const passwordHash = await this.passwordHasher.hash(dto.password);

    // Create domain entity
    const user = User.create(
      dto.username,
      dto.fullName,
      dto.mail,
      passwordHash,
    );

    // Save user
    const savedUser = await this.userRepository.save(user);

    this.logger.log('User registered successfully', 'RegisterUseCase', {
      userId: savedUser.id,
      username: savedUser.username,
    });

    // Generate tokens
    const accessToken = this.jwtService.sign({
      userId: savedUser.id,
      email: savedUser.mail,
    });

    const refreshToken = this.jwtService.signRefreshToken({
      userId: savedUser.id,
      email: savedUser.mail,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        fullName: savedUser.fullName,
        mail: savedUser.mail,
      },
    };
  }
}