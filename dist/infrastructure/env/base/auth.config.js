"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = void 0;
const zod_1 = require("zod");
const authConfigSchema = zod_1.z.object({
    jwtSecret: zod_1.z.string().min(32, 'JWT secret must be at least 32 characters').default('your-super-secret-jwt-key-change-in-production-min-32-chars'),
    jwtExpiresIn: zod_1.z.string().default('24h'),
    jwtAlgorithm: zod_1.z.enum(['HS256', 'HS384', 'HS512']).default('HS256'),
    enableAuth: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .default('false'),
    refreshTokenSecret: zod_1.z.string().min(32).default('your-refresh-token-secret-change-in-production'),
    refreshTokenExpiresIn: zod_1.z.string().default('7d'),
});
const authConfig = () => {
    return authConfigSchema.parse({
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
        jwtAlgorithm: process.env.JWT_ALGORITHM,
        enableAuth: process.env.ENABLE_AUTH,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
};
exports.authConfig = authConfig;
//# sourceMappingURL=auth.config.js.map