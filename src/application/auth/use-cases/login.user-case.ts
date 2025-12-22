import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { PasswordHasherPort } from '../../shared/ports/password-hasher.port';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtService } from '@infrastructure/services/jwt.service';
import { AppLoggerService } from '@infrastructure/observability/logger.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly jwtService: JwtService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log('Login attempt', 'LoginUseCase', { usernameOrEmail: dto.usernameOrEmail }, dto.usernameOrEmail);

    // Find user by username or email
    let user = await this.userRepository.findByUsername(dto.usernameOrEmail);
    console.log("user by userName", user);
    if (!user) {
      user = await this.userRepository.findByEmail(dto.usernameOrEmail);
      console.log("user by userName", user);
    }

    if (!user) {
      this.logger.warn('Login failed - user not found', 'LoginUseCase', { usernameOrEmail: dto.usernameOrEmail }, dto.usernameOrEmail);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    this.logger.debug('Verifying password', 'LoginUseCase', { userId: user.id }, user.username);
    const isPasswordValid = await this.passwordHasher.verify(dto.password, user.getPasswordHash(), user.username);

    if (!isPasswordValid) {
      this.logger.warn('Login failed - invalid password', 'LoginUseCase', { userId: user.id }, user.username);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log('User logged in successfully', 'LoginUseCase', {
      userId: user.id,
      username: user.username,
    }, user.username);

    // Generate tokens
    const accessToken = this.jwtService.sign({
      userId: user.id,
      email: user.mail,
    }, user.username);

    const refreshToken = this.jwtService.signRefreshToken({
      userId: user.id,
      email: user.mail,
    }, user.username);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        mail: user.mail,
      },
    };
  }
}