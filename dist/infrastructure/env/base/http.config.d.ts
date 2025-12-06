import { z } from 'zod';
declare const httpConfigSchema: z.ZodObject<{
    enableRequestId: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
    enableCorrelationId: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
    requestIdHeader: z.ZodDefault<z.ZodString>;
    correlationIdHeader: z.ZodDefault<z.ZodString>;
    corsOrigin: z.ZodDefault<z.ZodString>;
    corsEnabled: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    enableRequestId: boolean;
    enableCorrelationId: boolean;
    requestIdHeader: string;
    correlationIdHeader: string;
    corsOrigin: string;
    corsEnabled: boolean;
}, {
    enableRequestId?: string | undefined;
    enableCorrelationId?: string | undefined;
    requestIdHeader?: string | undefined;
    correlationIdHeader?: string | undefined;
    corsOrigin?: string | undefined;
    corsEnabled?: string | undefined;
}>;
export type HttpConfig = z.infer<typeof httpConfigSchema>;
export declare const httpConfig: () => HttpConfig;
export {};
