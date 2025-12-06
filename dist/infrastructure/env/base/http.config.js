"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpConfig = void 0;
const zod_1 = require("zod");
const httpConfigSchema = zod_1.z.object({
    enableRequestId: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .default('true'),
    enableCorrelationId: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .default('true'),
    requestIdHeader: zod_1.z.string().default('x-request-id'),
    correlationIdHeader: zod_1.z.string().default('x-correlation-id'),
    corsOrigin: zod_1.z.string().default('*'),
    corsEnabled: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .default('true'),
});
const httpConfig = () => {
    return httpConfigSchema.parse({
        enableRequestId: process.env.ENABLE_REQUEST_ID,
        enableCorrelationId: process.env.ENABLE_CORRELATION_ID,
        requestIdHeader: process.env.REQUEST_ID_HEADER,
        correlationIdHeader: process.env.CORRELATION_ID_HEADER,
        corsOrigin: process.env.CORS_ORIGIN,
        corsEnabled: process.env.CORS_ENABLED,
    });
};
exports.httpConfig = httpConfig;
//# sourceMappingURL=http.config.js.map