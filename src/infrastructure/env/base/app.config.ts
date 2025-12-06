import { z } from 'zod';

const appConfigSchema = z.object({
  port: z
    .string()
    .transform((val: string) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(65535))
    .default('3000'),
  nodeEnv: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export const appConfig = (): AppConfig => {
  return appConfigSchema.parse({
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
  });
};

