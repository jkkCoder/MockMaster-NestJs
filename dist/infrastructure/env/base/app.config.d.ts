import { z } from 'zod';
declare const appConfigSchema: z.ZodObject<{
    port: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
}, "strip", z.ZodTypeAny, {
    port: number;
    nodeEnv: "production" | "development" | "test";
}, {
    port?: string | undefined;
    nodeEnv?: "production" | "development" | "test" | undefined;
}>;
export type AppConfig = z.infer<typeof appConfigSchema>;
export declare const appConfig: () => AppConfig;
export {};
