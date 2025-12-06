"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observabilityConfig = void 0;
const zod_1 = require("zod");
const observabilityConfigSchema = zod_1.z.object({
    logLevel: zod_1.z
        .enum(['error', 'warn', 'info', 'debug', 'verbose'])
        .default('info'),
    enableMetrics: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .default('true'),
    enableTracing: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .default('false'),
    metricsPort: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number().int().min(1).max(65535))
        .default('9090'),
    otlpEndpoint: zod_1.z.string().url().optional(),
    serviceName: zod_1.z.string().min(1).default('nest-base-api'),
    serviceVersion: zod_1.z.string().min(1).default('1.0.0'),
});
const observabilityConfig = () => {
    return observabilityConfigSchema.parse({
        logLevel: process.env.LOG_LEVEL,
        enableMetrics: process.env.ENABLE_METRICS,
        enableTracing: process.env.ENABLE_TRACING,
        metricsPort: process.env.METRICS_PORT,
        otlpEndpoint: process.env.OTLP_ENDPOINT,
        serviceName: process.env.SERVICE_NAME,
        serviceVersion: process.env.SERVICE_VERSION,
    });
};
exports.observabilityConfig = observabilityConfig;
//# sourceMappingURL=observability.config.js.map