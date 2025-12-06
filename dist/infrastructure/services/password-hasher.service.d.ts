import { PasswordHasherPort } from '@application/shared/ports/password-hasher.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
export declare class PasswordHasherService implements PasswordHasherPort {
    private readonly logger;
    private readonly saltRounds;
    constructor(logger: AppLoggerService);
    hash(password: string): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
}
