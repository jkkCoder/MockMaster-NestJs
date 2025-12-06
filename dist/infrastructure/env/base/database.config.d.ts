import { z } from 'zod';
declare const databaseConfigSchema: z.ZodObject<{
    host: z.ZodDefault<z.ZodString>;
    port: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    username: z.ZodDefault<z.ZodString>;
    password: z.ZodDefault<z.ZodString>;
    database: z.ZodDefault<z.ZodString>;
    testDatabase: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    database: string;
    port: number;
    host: string;
    username: string;
    password: string;
    testDatabase: string;
}, {
    database?: string | undefined;
    port?: string | undefined;
    host?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
    testDatabase?: string | undefined;
}>;
export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
export declare const databaseConfig: () => DatabaseConfig;
export {};
