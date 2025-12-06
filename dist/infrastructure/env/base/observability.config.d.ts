import { z } from 'zod';
declare const observabilityConfigSchema: z.ZodObject<{
    logLevel: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug", "verbose"]>>;
    enableMetrics: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
    enableTracing: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
    metricsPort: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    otlpEndpoint: z.ZodOptional<z.ZodString>;
    serviceName: z.ZodDefault<z.ZodString>;
    serviceVersion: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    logLevel: "error" | "warn" | "info" | "debug" | "verbose";
    enableMetrics: boolean;
    enableTracing: boolean;
    metricsPort: number;
    serviceName: string;
    serviceVersion: string;
    otlpEndpoint?: string | undefined;
}, {
    logLevel?: "error" | "warn" | "info" | "debug" | "verbose" | undefined;
    enableMetrics?: string | undefined;
    enableTracing?: string | undefined;
    metricsPort?: string | undefined;
    otlpEndpoint?: string | undefined;
    serviceName?: string | undefined;
    serviceVersion?: string | undefined;
}>;
export type ObservabilityConfig = z.infer<typeof observabilityConfigSchema>;
export declare const observabilityConfig: () => ObservabilityConfig;
export {};
