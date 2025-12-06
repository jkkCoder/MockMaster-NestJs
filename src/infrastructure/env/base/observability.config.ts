import { z } from 'zod';

const observabilityConfigSchema = z.object({
  logLevel: z
    .enum(['error', 'warn', 'info', 'debug', 'verbose'])
    .default('info'),
  enableMetrics: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('true'),
  enableTracing: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),
  metricsPort: z
    .string()
    .transform((val: string) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(65535))
    .default('9090'),
  otlpEndpoint: z.string().url().optional(),
  serviceName: z.string().min(1).default('nest-base-api'),
  serviceVersion: z.string().min(1).default('1.0.0'),
});

export type ObservabilityConfig = z.infer<typeof observabilityConfigSchema>;

export const observabilityConfig = (): ObservabilityConfig => {
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

