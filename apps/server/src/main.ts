import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { EnvService } from './config/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  const envService = app.get(EnvService)
  const logger = new ConsoleLogger({
    prefix: envService.app.name,
  })
  app.useLogger(logger)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    // forbidNonWhitelisted: true
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
