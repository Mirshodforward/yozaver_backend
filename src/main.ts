import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { loadRuntimeConfig } from './config/runtime-config.js';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const runtime = loadRuntimeConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  // Production traffic enters through the single Nginx hop on loopback.
  if (runtime.production) app.set('trust proxy', 1);
  app.enableShutdownHooks();

  app.enableCors({
    origin: runtime.corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  if (runtime.swagger) {
    const config = new DocumentBuilder()
      .setTitle('Yozaver API')
      .setDescription(
        'Typing speed test backend — auth, results, leaderboard, admin',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(runtime.port, '0.0.0.0');
}
await bootstrap();
