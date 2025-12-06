import { z } from 'zod';

/**
 * API Versioning Configuration
 *
 * Enterprise-level API versioning strategy with support for:
 * - URL-based versioning: /api/v1/users
 * - Header-based versioning: Accept: application/vnd.api+json;version=1
 * - Default version fallback
 * - Version negotiation
 */
const apiConfigSchema = z.object({
  /**
   * Versioning strategy: 'url' | 'header' | 'both'
   * - 'url': Version in URL path (e.g., /api/v1/users)
   * - 'header': Version in Accept header (e.g., Accept: application/vnd.api+json;version=1)
   * - 'both': Support both URL and header-based versioning
   */
  versioningStrategy: z
    .enum(['url', 'header', 'both'])
    .default('url'),

  /**
   * Default API version when no version is specified
   * Format: 'v1', 'v2', etc.
   */
  defaultVersion: z.string().regex(/^v\d+$/).default('v1'),

  /**
   * Supported API versions (comma-separated)
   * Example: 'v1,v2'
   */
  supportedVersions: z
    .string()
    .transform((val) => val.split(',').map((v) => v.trim()))
    .pipe(z.array(z.string().regex(/^v\d+$/)))
    .default('v1'),

  /**
   * API prefix (before version)
   * Example: 'api' -> /api/v1/users
   */
  prefix: z.string().default('api'),

  /**
   * Header name for header-based versioning
   * Default: 'Accept' (standard REST API versioning header)
   */
  versionHeader: z.string().default('Accept'),

  /**
   * Header value pattern for version extraction
   * Default: 'application/vnd.api+json' (vendor media type for API versioning)
   * Version is extracted from: application/vnd.api+json;version=1
   */
  versionHeaderPattern: z.string().default('application/vnd.api+json'),

  /**
   * Enable version negotiation (automatically select best matching version)
   */
  enableVersionNegotiation: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('true'),

  /**
   * Strict version checking (reject requests with unsupported versions)
   */
  strictVersioning: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('true'),
});

export type ApiConfig = z.infer<typeof apiConfigSchema>;

export const apiConfig = (): ApiConfig => {
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

