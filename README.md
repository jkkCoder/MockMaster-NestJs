# NestJS Base API - Enterprise Clean Architecture Template

A production-ready NestJS API template following Clean Architecture principles, designed for enterprise-scale applications (20-30+ features) with comprehensive testing and type-safe environment configuration.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** with a hybrid organization strategy optimized for enterprise applications:

- **Domain & Application**: Organized by **feature** (user/, order/, etc.) - groups business logic by feature
- **Infrastructure**: Organized by **technical concern** (database/, cache/, etc.) - groups adapters by technology
- **Interface**: Organized by **feature** (user/, order/, etc.) - groups HTTP controllers by feature

### Project Structure

```
src/
├── domain/                           ← Feature-based: Business logic by feature
│   ├── user/                        ← User feature domain code
│   │   ├── entities/
│   │   └── value-objects/
│   ├── order/                       ← Order feature domain code
│   │   └── entities/
│   └── shared/                      ← Shared domain code (base entities, errors)
│
├── application/                     ← Feature-based: Use cases by feature
│   ├── user/                        ← User feature application code
│   │   ├── dto/
│   │   ├── ports/
│   │   └── use-cases/
│   ├── order/                       ← Order feature application code
│   │   ├── dto/
│   │   ├── ports/
│   │   └── use-cases/
│   └── shared/                      ← Shared application code
│       └── ports/
│
├── infrastructure/                   ← Technical concern-based: Adapters by technology
│   ├── database/                    ← All database adapters together
│   │   ├── repositories/            ← All repos (user.repository.ts, order.repository.ts, ...)
│   │   ├── entities/                 ← All TypeORM entities (for TypeORM config)
│   │   ├── migrations/              ← All database migrations
│   │   ├── database.module.ts        ← Shared database configuration
│   │   └── data-source.ts           ← TypeORM data source
│   ├── modules/                     ← Feature-specific wiring modules
│   │   ├── user.module.ts           ← Wires user repo + services
│   │   └── order.module.ts          ← Wires order repo
│   ├── services/                    ← Shared technical services
│   ├── cache/                       ← Future: Redis, Memcached adapters
│   ├── external-services/           ← Future: payment, email, SMS providers
│   └── env/                         ← Environment configuration
│       ├── base/                    ← Zod schemas (source of truth)
│       └── dev/                     ← Environment-specific configs
│
└── interface/                        ← Feature-based: Controllers by feature
    ├── user/                        ← User feature controllers
    │   └── controllers/
    ├── order/                       ← Order feature controllers
    │   └── controllers/
    ├── shared/                      ← Shared interface code
    │   ├── controllers/              ← Metrics endpoint
    │   ├── filters/                 ← Exception filters
    │   ├── guards/                  ← Authentication guards
    │   ├── decorators/              ← Custom decorators (@Public, @CurrentUser)
    │   └── interceptors/            ← HTTP interceptors (headers, logging)
    └── app.module.ts                ← Root application module
```

### Why This Structure?

1. **Business Logic Grouped by Feature**: Domain & Application code stays together by feature, making it easy to find all user-related business code
2. **Infrastructure Grouped by Technology**: All database repos in `database/repositories/`, all cache adapters in `cache/` - perfect for tech teams
3. **Enterprise Scalability**: Handles 20-30+ features without clutter - all repos in one folder is manageable
4. **Clear Separation**: Business concerns (features) vs technical concerns (adapters)

### Key Principles

- **Domain**: Pure business logic (entities, value objects) - zero NestJS imports
- **Application**: Use cases, DTOs, ports (interfaces) - thin orchestration layer
- **Infrastructure**: Database adapters, repositories, external services - implements application ports
- **Interface**: Controllers, filters, HTTP middleware - presentation layer

**Constraints:**
- Domain never imports infrastructure
- Application never imports NestJS
- Infrastructure implements ports defined by application

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- Docker and Docker Compose (optional)

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   
   Create a `.env` file in the project root. You can reference the environment variable documentation below for all available configuration options.
   
   Development defaults:
   - Database Host: `localhost`
   - Database Port: `5432` (Note: if using docker-compose, check docker-compose.yml for port mapping)
   - Database Username: `postgres`
   - Database Password: `postgres`
   - Database Name: `base`
   - Test Database: `base_test`

3. **Start PostgreSQL** (using Docker)
   ```bash
   docker-compose up -d
   ```

4. **Run Migrations**
   ```bash
   npm run migrate
   ```

5. **Start Development Server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000/api/v1`

6. **Access Swagger Documentation**
   - OpenAPI/Swagger UI: `http://localhost:3000/docs`
   - Interactive API documentation with request/response examples
   - Test endpoints directly from the browser

## 📝 Environment Configuration

⚠️ **CRITICAL: Never read `process.env` directly!**

All environment variables are managed through type-safe Zod schemas:

1. **Define variables** in `src/infrastructure/env/base/*.config.ts`
2. **Import config** using: `import { env } from '@infrastructure/env/base'`
3. **Use validated values**: `const port = env.app.port`

### Adding New Environment Variables

1. Add schema to appropriate config file in `base/`:
   ```typescript
   // base/my-service.config.ts
   const myServiceConfigSchema = z.object({
     apiKey: z.string().min(1),
     timeout: z.string().transform(val => parseInt(val)).pipe(z.number()),
   });
   ```

2. Export from `base/index.ts`

3. Use throughout the application:
   ```typescript
   import { env } from '@infrastructure/env/base';
   const apiKey = env.myService.apiKey;
   ```

### Validate Environment

```bash
npm run env:validate
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit           # Unit tests only
npm run test:integration     # Integration tests
npm run test:e2e            # End-to-end tests

# With coverage
npm run test:cov
```

### Testing Strategy

- **Domain**: Unit tests only (fast, deterministic, no DB)
- **Application**: Unit tests with mocked ports
- **Infrastructure & Interface**: Integration tests with test DB
- **E2E**: Real HTTP calls against disposable environment

## 📦 Database Migrations

```bash
# Run migrations
npm run migrate

# Generate a new migration
npm run migrate:generate -- -n MigrationName

# Revert last migration
npm run migrate:revert

# Show migration status
npm run migrate:show
```

**Guidelines:**
- Always use migrations for schema changes (never `synchronize: true` in production)
- Keep migrations small and focused
- Ensure migrations are reversible when possible
- Never edit existing migrations that have been run in production

## ➕ Adding a New Feature

To add a new feature (e.g., `product`):

1. **Domain**: `domain/product/entities/product.entity.ts`
2. **Application**:
   - `application/product/dto/` - DTOs
   - `application/product/ports/` - Port interfaces
   - `application/product/use-cases/` - Use cases
3. **Infrastructure**:
   - `infrastructure/database/repositories/product.repository.ts` - Add to existing repos folder
   - `infrastructure/database/entities/product.entity.ts` - Add to existing entities folder
   - `infrastructure/modules/product.module.ts` - Feature-specific wiring module
4. **Interface**:
   - `interface/product/controllers/` - REST controller

**Key Point**: Infrastructure repositories go in `database/repositories/` (technical concern), while domain/application code goes in feature folders (business concern).

## 🚀 API Versioning

### Enterprise-Level Versioning Strategy

The API supports enterprise-grade versioning with multiple strategies:

#### **URL-Based Versioning** (Default)
Version specified in the URL path:
```bash
GET /api/v1/users
GET /api/v2/users
POST /api/v1/orders
```

#### **Header-Based Versioning**
Version specified in the `Accept` header:
```bash
GET /api/users
Accept: application/vnd.api+json;version=1

GET /api/users
Accept: application/vnd.api+json;version=2
```

#### **Both Strategies** (Hybrid)
Support both URL and header-based versioning simultaneously:
```bash
# URL versioning
GET /api/v1/users

# Header versioning
GET /api/users
Accept: application/vnd.api+json;version=1
```

### Configuration Options

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `API_VERSIONING_STRATEGY` | Versioning strategy: `url`, `header`, or `both` | `url` |
| `API_DEFAULT_VERSION` | Default version when none specified | `v1` |
| `API_SUPPORTED_VERSIONS` | Comma-separated supported versions | `v1` |
| `API_PREFIX` | API prefix before version | `api` |
| `API_VERSION_HEADER` | Header name for header-based versioning | `Accept` |
| `API_ENABLE_VERSION_NEGOTIATION` | Fallback to default if version unsupported | `true` |
| `API_STRICT_VERSIONING` | Reject unsupported versions | `true` |

### Version Negotiation

When `API_ENABLE_VERSION_NEGOTIATION=true` and a client requests an unsupported version, the API will:
1. Log a warning
2. Use the default version instead
3. Return the response with the negotiated version

### Version-Optional Routes

Certain routes (health checks, metrics) can be marked as version-optional using `@VersionOptional()` decorator. These endpoints work both with and without version specification:

- **Health Checks**: `/health`, `/health/live`, `/health/ready` (work without version)
- **Metrics**: `/metrics` (works without version)

```typescript
@Controller('health')
@VersionOptional()
export class HealthController {
  // Works with or without version specification
  // Can be accessed as /health or /api/v1/health
}
```

### Adding New Versions

1. Update `API_SUPPORTED_VERSIONS` in environment:
   ```bash
   API_SUPPORTED_VERSIONS=v1,v2
   ```

2. Create version-specific controllers (if needed):
   ```typescript
   @Controller('users')
   @ApiVersion('v2')
   export class UserV2Controller {
     // v2-specific implementation
   }
   ```

3. The system automatically routes to the correct version based on the strategy.

## 📚 Example API Usage

### Create User (URL-based versioning)
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }'
```

### Create User (Header-based versioning)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.api+json;version=1" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }'
```

### Get User
```bash
curl http://localhost:3000/api/v1/users/{userId}
```

### Health Check (Version-Optional)
```bash
# Works without version (recommended for health checks)
curl http://localhost:3000/health

# Also works with version
curl http://localhost:3000/api/v1/health

# Liveness probe
curl http://localhost:3000/health/live

# Readiness probe
curl http://localhost:3000/health/ready
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "items": [
      {
        "productId": "prod-1",
        "productName": "Product 1",
        "quantity": 2,
        "unitPrice": 10.50
      }
    ]
  }'
```

## 🛠️ Available Scripts

### Development
- `npm run start` - Start the application
- `npm run start:dev` - Start in watch mode
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build for production

### Testing
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

### Database
- `npm run migrate` - Run migrations
- `npm run migrate:generate` - Generate new migration
- `npm run migrate:revert` - Revert last migration
- `npm run migrate:show` - Show migration status

### Code Quality
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run env:validate` - Validate environment configuration
- `npm run sonar` - Run SonarQube analysis
- `npm run snyk:test` - Test for vulnerabilities with Snyk
- `npm run snyk:monitor` - Monitor project with Snyk
- `npm run snyk:test:ci` - Snyk test for CI (fails on high severity)

## 📊 Observability

The application includes comprehensive observability features with logging, metrics, and tracing support.

### Logging

**Structured logging** supporting both console output (local development) and JSON format (CloudWatch/log aggregators):

- **Log Levels**: `error`, `warn`, `info`, `debug`, `verbose`
- **Configuration**: Set via `LOG_LEVEL` environment variable
- **Automatic HTTP logging**: All requests/responses logged via interceptor
- **Structured metadata**: Context and metadata support for better log searchability

#### Usage Examples

**In Services/Repositories:**
```typescript
import { AppLoggerService } from '@infrastructure/observability/logger.service';

@Injectable()
export class MyService {
  constructor(private readonly logger: AppLoggerService) {}

  async doSomething(data: any) {
    // Basic logging
    this.logger.log('Processing request', 'MyService');
    this.logger.debug('Debug information', 'MyService', { data });

    // With structured metadata (great for CloudWatch queries)
    this.logger.logWithContext('info', 'User processed', {
      userId: '123',
      action: 'process',
      duration: 45,
    }, 'MyService');

    // Error logging with stack trace
    try {
      // ... operation
    } catch (error) {
      this.logger.error(
        'Operation failed',
        error instanceof Error ? error.stack : undefined,
        'MyService',
        { userId: '123', operation: 'process' }
      );
      throw error;
    }
  }
}
```

**In Use Cases:**
```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(dto: CreateUserDto) {
    this.logger.log('Creating user', 'CreateUserUseCase', { email: dto.email });
    // ... business logic
    this.logger.log('User created', 'CreateUserUseCase', { userId: user.id });
  }
}
```

**In Controllers:**
```typescript
@Controller('users')
export class UserController {
  constructor(
    private readonly useCase: CreateUserUseCase,
    private readonly logger: AppLoggerService,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    this.logger.log('Received create request', 'UserController', { email: dto.email });
    // ... controller logic
  }
}
```

#### Log Output Formats

**Local Development (Human-readable):**
```
ℹ️ [2024-01-15T10:30:45.123Z] [INFO] [UserService] Processing request {"userId":"123","action":"create"}
❌ [2024-01-15T10:30:45.456Z] [ERROR] [UserService] Operation failed {"userId":"123","error":"validation failed"}
```

**Production/CloudWatch (Structured JSON):**
```json
{"timestamp":"2024-01-15T10:30:45.123Z","level":"INFO","message":"Processing request","context":"UserService","userId":"123","action":"create","service":"nest-base-api","version":"1.0.0"}
{"timestamp":"2024-01-15T10:30:45.456Z","level":"ERROR","message":"Operation failed","context":"UserService","userId":"123","error":"validation failed","service":"nest-base-api","version":"1.0.0","trace":"Error: validation failed\n    at..."}
```

**Benefits:**
- **Console output** for local debugging with emojis and readable format
- **JSON format** for CloudWatch, Datadog, or any log aggregator
- **Structured metadata** enables powerful log queries (e.g., find all errors for userId=123)
- **Automatic HTTP logging** via interceptor (no manual logging needed in controllers)

### HTTP Interceptor

Common HTTP concerns handled via `HttpInterceptor`:

- **Request ID**: Unique identifier for each request (enables request tracing)
- **Correlation ID**: For distributed tracing across services
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, etc.
- **CORS**: Configurable CORS settings

**Headers are automatically:**
- Generated if not provided by client
- Added to all responses
- Available in controllers via request object: `request.requestId`, `request.correlationId`

**Usage in Controllers:**
```typescript
@Get('profile')
@UseGuards(AuthGuard)
getProfile(@Req() request: AuthenticatedRequest) {
  const requestId = request.requestId; // Automatically set by HttpInterceptor
  const correlationId = request.correlationId;
  // Use for distributed tracing
}
```

**Note:** This interceptor can be extended for additional HTTP concerns like rate limiting, request validation, etc.

### Authentication & Authorization

JWT-based authentication with guard and decorators:

**Features:**
- JWT token validation
- Optional authentication (can be disabled via `ENABLE_AUTH=false`)
- Public route decorator (`@Public()`) to skip authentication
- Current user decorator (`@CurrentUser()`) to access authenticated user

**Usage:**

```typescript
// Protect entire controller
@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  // This endpoint requires authentication
  @Get()
  getAll(@CurrentUser() user: JwtPayload) {
    // user.userId, user.email available
    return this.orderService.findByUserId(user.userId);
  }

  // Public endpoint (skip auth)
  @Public()
  @Get('public')
  publicEndpoint() {
    return { message: 'No auth required' };
  }
}

// Or protect individual endpoints
@Controller('users')
export class UserController {
  @Public() // Registration doesn't need auth
  @Post()
  create(@Body() dto: CreateUserDto) {
    // ...
  }

  @Get('profile') // Requires auth
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
```

**Generate JWT Tokens:**
```typescript
import { JwtService } from '@infrastructure/services/jwt.service';

// In login use case
const token = this.jwtService.sign({ userId: user.id, email: user.email });
const refreshToken = this.jwtService.signRefreshToken({ userId: user.id, email: user.email });
```

**Environment Variables:**
```bash
ENABLE_AUTH=true
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=24h
JWT_ALGORITHM=HS256
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

### Metrics

Prometheus-compatible metrics exposed at `/metrics` (version-optional endpoint):

**Note:** The metrics endpoint is marked as version-optional, so it works both with and without version specification:
- `/metrics` (works without version)
- `/api/v1/metrics` (works with version)

- **HTTP Metrics**:
  - `http_requests_total` - Total HTTP requests
  - `http_request_duration_seconds` - Request duration histogram
  - `http_requests_errors_total` - HTTP error counter

- **Database Metrics**:
  - `db_queries_total` - Total database queries
  - `db_query_duration_seconds` - Query duration histogram
  - `db_query_errors_total` - Database error counter

**Access Metrics:**
```bash
# Works without version (version-optional endpoint)
curl http://localhost:3000/metrics

# Also works with version
curl http://localhost:3000/api/v1/metrics
```

**Configuration:**
- `ENABLE_METRICS=true` - Enable/disable metrics collection
- `METRICS_PORT=9090` - Metrics endpoint port (default: same as app port)

### Tracing (Future)

OpenTelemetry support for distributed tracing:
- Configure `ENABLE_TRACING=true` and `OTLP_ENDPOINT` for trace collection
- Ready for integration with Jaeger, Zipkin, or cloud providers

### Environment Variables

Add to your `.env`:
```bash
# Observability Configuration
LOG_LEVEL=info
ENABLE_METRICS=true
ENABLE_TRACING=false
METRICS_PORT=9090
SERVICE_NAME=nest-base-api
SERVICE_VERSION=1.0.0
OTLP_ENDPOINT=http://localhost:4318/v1/traces  # Optional

# HTTP Configuration
ENABLE_REQUEST_ID=true
ENABLE_CORRELATION_ID=true
REQUEST_ID_HEADER=x-request-id
CORRELATION_ID_HEADER=x-correlation-id
CORS_ENABLED=true
CORS_ORIGIN=*

# Authentication Configuration
ENABLE_AUTH=false  # Set to true to enable JWT authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars-long
JWT_EXPIRES_IN=24h
JWT_ALGORITHM=HS256
REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-in-production-min-32-chars
REFRESH_TOKEN_EXPIRES_IN=7d

# API Versioning Configuration
API_VERSIONING_STRATEGY=url  # Options: 'url', 'header', 'both'
API_DEFAULT_VERSION=v1
API_SUPPORTED_VERSIONS=v1  # Comma-separated: 'v1,v2'
API_PREFIX=api
API_VERSION_HEADER=Accept  # For header-based versioning
API_VERSION_HEADER_PATTERN=application/vnd.api+json
API_ENABLE_VERSION_NEGOTIATION=true  # Fallback to default version if unsupported
API_STRICT_VERSIONING=true  # Reject requests with unsupported versions
```

## 📚 API Documentation

### Swagger/OpenAPI

Interactive API documentation is available at `/docs` endpoint when the application is running.

**Access:**
- **Swagger UI**: `http://localhost:3000/docs` (Note: Swagger UI is not versioned)
- **JSON Schema**: `http://localhost:3000/docs-json`

**Features:**
- Interactive API explorer
- Request/response examples
- Authentication testing (JWT Bearer token)
- Try-it-out functionality for all endpoints
- Auto-generated from TypeScript decorators

**Documentation Coverage:**
- All DTOs with property descriptions and examples
- All endpoints with operation summaries and descriptions
- Authentication requirements (Bearer JWT)
- Response status codes and error scenarios
- Request/response schemas

**Using Swagger:**
1. Navigate to `http://localhost:3000/docs`
2. Use "Authorize" button to add JWT token (if auth is enabled)
3. Expand endpoints to see details - all endpoints are prefixed with `/api/v1`
4. Click "Try it out" to test endpoints
5. View request/response examples

**Note:** Swagger UI is accessible at `/docs` (not versioned), but all API endpoints are versioned under `/api/v1`.

## 🔍 Code Quality & Security

### SonarQube

Code quality analysis with SonarQube:

```bash
# Run SonarQube analysis
npm run sonar
```

**Configuration**: `sonar-project.properties`

**Features**:
- Code coverage analysis
- Code smell detection
- Security vulnerability scanning
- Technical debt tracking
- Quality gate enforcement

**CI Integration**: Configure SonarQube server URL in `sonar-project.properties` and add to CI pipeline.

### Snyk

Security vulnerability scanning:

```bash
# Test for vulnerabilities
npm run snyk:test

# Monitor project (creates project in Snyk dashboard)
npm run snyk:monitor

# CI mode (fails on high severity)
npm run snyk:test:ci
```

**Configuration**: `.snyk` file for ignore rules and patches

**Features**:
- Dependency vulnerability scanning
- License compliance checking
- Container image scanning (when added)
- CI/CD integration with PR checks

**Setup**:
1. Install Snyk CLI: `npm install -g snyk`
2. Authenticate: `snyk auth`
3. Run tests: `npm run snyk:test`

### CI/CD Integration

Example GitHub Actions workflow:
```yaml
- name: Run Tests
  run: npm run test:cov

- name: SonarQube Scan
  run: npm run sonar
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

- name: Snyk Security Scan
  run: npm run snyk:test:ci
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## 🏢 Enterprise Benefits

- **Scalability**: Handles 20-30+ features without structural clutter
- **Team Collaboration**: Tech teams find database code together, feature teams find business logic together
- **Type Safety**: Environment configuration validated with Zod schemas
- **Testability**: Clean separation allows easy mocking and testing
- **Maintainability**: Clear boundaries between business logic and technical adapters
- **Observability**: Built-in logging, metrics, and tracing support
- **Code Quality**: SonarQube and Snyk integration for continuous quality monitoring
- **Security**: Automated vulnerability scanning in CI/CD pipeline

## 📖 Additional Resources

### Framework & Architecture
- [NestJS Documentation](https://docs.nestjs.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeORM Documentation](https://typeorm.io/)

### Observability
- [Prometheus Metrics](https://prometheus.io/docs/concepts/metric_types/)
- [OpenTelemetry](https://opentelemetry.io/)

### Code Quality
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Snyk Documentation](https://docs.snyk.io/)

## 📄 License

This is a template repository. Customize as needed for your project.

