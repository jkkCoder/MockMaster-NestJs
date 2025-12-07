import { RegisterDto } from '@application/auth/dto/register.dto';
import { LoginDto } from '@application/auth/dto/login.dto';
import { AuthResponseDto } from '@application/auth/dto/auth-response.dto';
import { RegisterUseCase } from '@application/auth/use-cases/register.use-case';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { LoginUseCase } from '@application/auth/use-cases/login.user-case';
export declare class AuthController {
    private readonly registerUseCase;
    private readonly loginUseCase;
    private readonly logger;
    constructor(registerUseCase: RegisterUseCase, loginUseCase: LoginUseCase, logger: AppLoggerService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
}
