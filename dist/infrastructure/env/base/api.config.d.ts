import { z } from 'zod';
declare const apiConfigSchema: z.ZodObject<{
    versioningStrategy: z.ZodDefault<z.ZodEnum<["url", "header", "both"]>>;
    defaultVersion: z.ZodDefault<z.ZodString>;
    supportedVersions: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, string[], string>, z.ZodArray<z.ZodString, "many">>>;
    prefix: z.ZodDefault<z.ZodString>;
    versionHeader: z.ZodDefault<z.ZodString>;
    versionHeaderPattern: z.ZodDefault<z.ZodString>;
    enableVersionNegotiation: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
    strictVersioning: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    versioningStrategy: "url" | "header" | "both";
    defaultVersion: string;
    supportedVersions: string[];
    prefix: string;
    versionHeader: string;
    versionHeaderPattern: string;
    enableVersionNegotiation: boolean;
    strictVersioning: boolean;
}, {
    versioningStrategy?: "url" | "header" | "both" | undefined;
    defaultVersion?: string | undefined;
    supportedVersions?: string | undefined;
    prefix?: string | undefined;
    versionHeader?: string | undefined;
    versionHeaderPattern?: string | undefined;
    enableVersionNegotiation?: string | undefined;
    strictVersioning?: string | undefined;
}>;
export type ApiConfig = z.infer<typeof apiConfigSchema>;
export declare const apiConfig: () => ApiConfig;
export {};
