import { z } from 'zod';

const authConfigSchema = z.object({
  jwtSecret: z.string().min(32, 'JWT secret must be at least 32 characters').default('your-super-secret-jwt-key-change-in-production-min-32-chars'),
  jwtExpiresIn: z.string().default('24h'),
  jwtAlgorithm: z.enum(['HS256', 'HS384', 'HS512']).default('HS256'),
  enableAuth: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),
  refreshTokenSecret: z.string().min(32).default('your-refresh-token-secret-change-in-production'),
  refreshTokenExpiresIn: z.string().default('7d'),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;

export const authConfig = (): AuthConfig => {
  return authConfigSchema.parse({
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtAlgorithm: process.env.JWT_ALGORITHM,
    enableAuth: process.env.ENABLE_AUTH,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

