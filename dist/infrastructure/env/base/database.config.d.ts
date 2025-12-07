import { z } from 'zod';
declare const databaseConfigSchema: z.ZodObject<{
    host: z.ZodDefault<z.ZodString>;
    port: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    username: z.ZodDefault<z.ZodString>;
    password: z.ZodDefault<z.ZodString>;
    database: z.ZodDefault<z.ZodString>;
    testDatabase: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    testDatabase: string;
}, {
    host?: string | undefined;
    port?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
    database?: string | undefined;
    testDatabase?: string | undefined;
}>;
export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
export declare const databaseConfig: () => DatabaseConfig;
export {};
