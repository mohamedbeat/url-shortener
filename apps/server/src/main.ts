import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { EnvService } from './config/env/env.service';
import cookieParser from 'cookie-parser';
import { DetailedLoggingInterceptor } from './common/interceptor/req.interceptor';

// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
    },
  });
  app.use(cookieParser())
  const envService = app.get(EnvService)
  const logger = new ConsoleLogger({
    prefix: envService.app.name,
  })


  app.useLogger(logger)
  app.useGlobalInterceptors(new DetailedLoggingInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    // forbidNonWhitelisted: true
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
