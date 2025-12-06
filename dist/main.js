"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./interface/app.module");
const app_config_1 = require("./infrastructure/env/base/app.config");
const http_config_1 = require("./infrastructure/env/base/http.config");
const api_config_1 = require("./infrastructure/env/base/api.config");
const observability_config_1 = require("./infrastructure/env/base/observability.config");
const logger_service_1 = require("./infrastructure/observability/logger.service");
async function bootstrap() {
    const config = (0, app_config_1.appConfig)();
    const httpConf = (0, http_config_1.httpConfig)();
    const apiConf = (0, api_config_1.apiConfig)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new logger_service_1.AppLoggerService(),
    });
    if (httpConf.corsEnabled) {
        app.enableCors({
            origin: httpConf.corsOrigin === '*' ? true : httpConf.corsOrigin.split(','),
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                httpConf.requestIdHeader,
                httpConf.correlationIdHeader,
            ],
            exposedHeaders: [
                httpConf.requestIdHeader,
                httpConf.correlationIdHeader,
            ],
        });
    }
    if (apiConf.versioningStrategy === 'url' || apiConf.versioningStrategy === 'both') {
        const globalPrefix = `${apiConf.prefix}/${apiConf.defaultVersion}`;
        app.setGlobalPrefix(globalPrefix, {
            exclude: ['/docs', '/docs-json'],
        });
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('MockMaster API')
        .setDescription('Mock Test Management API with Clean Architecture')
        .setVersion((0, observability_config_1.observabilityConfig)().serviceVersion)
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    await app.listen(config.port);
    const logger = app.get(logger_service_1.AppLoggerService);
    logger.log(`Application is running on: http://localhost:${config.port}`, 'Bootstrap');
    logger.log(`Swagger documentation available at: http://localhost:${config.port}/docs`, 'Bootstrap');
    const apiPrefix = apiConf.versioningStrategy === 'url' || apiConf.versioningStrategy === 'both'
        ? `${apiConf.prefix}/${apiConf.defaultVersion}`
        : apiConf.prefix;
    logger.log(`API endpoints available at: http://localhost:${config.port}/${apiPrefix}`, 'Bootstrap');
    logger.log(`API versioning strategy: ${apiConf.versioningStrategy}, Supported versions: ${apiConf.supportedVersions.join(', ')}`, 'Bootstrap');
    process.on('SIGINT', async () => {
        logger.log('Shutting down gracefully...', 'Bootstrap');
        await app.close();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        logger.log('Shutting down gracefully...', 'Bootstrap');
        await app.close();
        process.exit(0);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map