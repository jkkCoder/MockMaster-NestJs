import { z } from 'zod';
declare const authConfigSchema: z.ZodObject<{
    jwtSecret: z.ZodDefault<z.ZodString>;
    jwtExpiresIn: z.ZodDefault<z.ZodString>;
    jwtAlgorithm: z.ZodDefault<z.ZodEnum<["HS256", "HS384", "HS512"]>>;
    enableAuth: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
    refreshTokenSecret: z.ZodDefault<z.ZodString>;
    refreshTokenExpiresIn: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtAlgorithm: "HS256" | "HS384" | "HS512";
    enableAuth: boolean;
    refreshTokenSecret: string;
    refreshTokenExpiresIn: string;
}, {
    jwtSecret?: string | undefined;
    jwtExpiresIn?: string | undefined;
    jwtAlgorithm?: "HS256" | "HS384" | "HS512" | undefined;
    enableAuth?: string | undefined;
    refreshTokenSecret?: string | undefined;
    refreshTokenExpiresIn?: string | undefined;
}>;
export type AuthConfig = z.infer<typeof authConfigSchema>;
export declare const authConfig: () => AuthConfig;
export {};
