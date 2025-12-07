import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './interface/app.module';
import { appConfig } from '@infrastructure/env/base/app.config';
import { httpConfig } from '@infrastructure/env/base/http.config';
import { apiConfig } from '@infrastructure/env/base/api.config';
import { observabilityConfig } from '@infrastructure/env/base/observability.config';
import { AppLoggerService } from '@infrastructure/observability/logger.service';

async function bootstrap() {
  const config = appConfig();
  const httpConf = httpConfig();
  const apiConf = apiConfig();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new AppLoggerService(),
  });

  // Increase body size limit to 10MB (adjust as needed)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS configuration
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

  // Configure API versioning strategy
  // URL-based versioning: /api/v1/endpoint, /api/v2/endpoint
  // Header-based versioning: Accept: application/vnd.api+json;version=1
  // Both: Support both strategies
  if (apiConf.versioningStrategy === 'url' || apiConf.versioningStrategy === 'both') {
    const globalPrefix = `${apiConf.prefix}/${apiConf.defaultVersion}`;
    app.setGlobalPrefix(globalPrefix, {
      exclude: ['/docs', '/docs-json'],
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MockMaster API')
    .setDescription('Mock Test Management API with Clean Architecture')
    .setVersion(observabilityConfig().serviceVersion)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(config.port);

  const logger = app.get(AppLoggerService);
  logger.log(`Application is running on: http://localhost:${config.port}`, 'Bootstrap');
  logger.log(`Swagger documentation available at: http://localhost:${config.port}/docs`, 'Bootstrap');
  
  // Log API versioning configuration
  const apiPrefix = apiConf.versioningStrategy === 'url' || apiConf.versioningStrategy === 'both'
    ? `${apiConf.prefix}/${apiConf.defaultVersion}`
    : apiConf.prefix;
  logger.log(
    `API endpoints available at: http://localhost:${config.port}/${apiPrefix}`,
    'Bootstrap',
  );
  logger.log(
    `API versioning strategy: ${apiConf.versioningStrategy}, Supported versions: ${apiConf.supportedVersions.join(', ')}`,
    'Bootstrap',
  );

  // Graceful shutdown
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

