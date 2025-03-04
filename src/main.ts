import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from './app-config/app-config.service';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set size limits for body parser
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: [
      'http://localhost:6333',
      'http://localhost:3600',
      'http://localhost:9000',
      'http://localhost:3000',
      'http://localhost:4200',
      'https://app.stage.version47.com',
      'https://app.version47.com',
      'https://ai.version47.com',
      'https://go.version47.com',
      'https://iterate.version47.com',
    ],
  });

  const appConfig = app.get(AppConfigService);
  const { version, port, openApiEnabled, welcome } = appConfig;
  console.log(
    `Starting Fetcher API v${version} on port ${appConfig.port}: ${welcome}`,
  );

  // Set up Swagger
  if (openApiEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Fetcher API')
      .setDescription('The endpoints available for the Fetcher API')
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Listen for shutdown signals
  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap();
