import { z } from 'zod';

const databaseConfigSchema = z.object({
  host: z.string().min(1).default('localhost'),
  port: z
    .string()
    .transform((val: string) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(65535))
    .default('3306'),
  username: z.string().min(1).default('root'),
  password: z.string().min(1).default('0.0.0.0.'),
  database: z.string().min(1).default('mock_master'),
  testDatabase: z.string().min(1).default('mock_master_test'),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

export const databaseConfig = (): DatabaseConfig => {
  return databaseConfigSchema.parse({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    testDatabase: process.env.DB_TEST_NAME,
  });
};

