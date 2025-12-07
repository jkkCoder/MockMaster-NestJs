import { UserRepositoryPort } from '../ports/user-repository.port';
import { PasswordHasherPort } from '../../shared/ports/password-hasher.port';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtService } from '@infrastructure/services/jwt.service';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
export declare class RegisterUseCase {
    private readonly userRepository;
    private readonly passwordHasher;
    private readonly jwtService;
    private readonly logger;
    constructor(userRepository: UserRepositoryPort, passwordHasher: PasswordHasherPort, jwtService: JwtService, logger: AppLoggerService);
    execute(dto: RegisterDto): Promise<AuthResponseDto>;
}
