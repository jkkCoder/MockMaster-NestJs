import { z } from 'zod';

const httpConfigSchema = z.object({
  enableRequestId: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('true'),
  enableCorrelationId: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('true'),
  requestIdHeader: z.string().default('x-request-id'),
  correlationIdHeader: z.string().default('x-correlation-id'),
  corsOrigin: z.string().default('*'),
  corsEnabled: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('true'),
});

export type HttpConfig = z.infer<typeof httpConfigSchema>;

export const httpConfig = (): HttpConfig => {
  return httpConfigSchema.parse({
    enableRequestId: process.env.ENABLE_REQUEST_ID,
    enableCorrelationId: process.env.ENABLE_CORRELATION_ID,
    requestIdHeader: process.env.REQUEST_ID_HEADER,
    correlationIdHeader: process.env.CORRELATION_ID_HEADER,
    corsOrigin: process.env.CORS_ORIGIN,
    corsEnabled: process.env.CORS_ENABLED,
  });
};

