"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = void 0;
const zod_1 = require("zod");
const apiConfigSchema = zod_1.z.object({
    versioningStrategy: zod_1.z
        .enum(['url', 'header', 'both'])
        .default('url'),
    defaultVersion: zod_1.z.string().regex(/^v\d+$/).default('v1'),
    supportedVersions: zod_1.z
        .string()
        .transform((val) => val.split(',').map((v) => v.trim()))
        .pipe(zod_1.z.array(zod_1.z.string().regex(/^v\d+$/)))
        .default('v1'),
    prefix: zod_1.z.string().default('api'),
    versionHeader: zod_1.z.string().default('Accept'),
    versionHeaderPattern: zod_1.z.string().default('application/vnd.api+json'),
    enableVersionNegotiation: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .default('true'),
    strictVersioning: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .default('true'),
});
const apiConfig = () => {
    return apiConfigSchema.parse({
        versioningStrategy: process.env.API_VERSIONING_STRATEGY,
        defaultVersion: process.env.API_DEFAULT_VERSION,
        supportedVersions: process.env.API_SUPPORTED_VERSIONS,
        prefix: process.env.API_PREFIX,
        versionHeader: process.env.API_VERSION_HEADER,
        versionHeaderPattern: process.env.API_VERSION_HEADER_PATTERN,
        enableVersionNegotiation: process.env.API_ENABLE_VERSION_NEGOTIATION,
        strictVersioning: process.env.API_STRICT_VERSIONING,
    });
};
exports.apiConfig = apiConfig;
//# sourceMappingURL=api.config.js.map