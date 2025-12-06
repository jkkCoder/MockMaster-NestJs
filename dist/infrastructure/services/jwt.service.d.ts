import { AppLoggerService } from '../observability/logger.service';
import { JwtPayload } from '@interface/shared/guards/auth.guard';
export declare class JwtService {
    private readonly logger;
    private readonly config;
    constructor(logger: AppLoggerService);
    sign(payload: {
        userId: string;
        email: string;
    }): string;
    signRefreshToken(payload: {
        userId: string;
        email: string;
    }): string;
    verify(token: string): JwtPayload;
    verifyRefreshToken(token: string): JwtPayload;
}
