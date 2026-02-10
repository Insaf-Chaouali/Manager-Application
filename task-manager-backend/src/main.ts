import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); // ajouter helmet pour la sécurité

  app.enableCors(); // autoriser frontend Next.js
  app.useGlobalPipes(
    new  ValidationPipe({
      whitelist: true,         
      forbidNonWhitelisted : true,
      transform: true,
    }));
  
  await app.listen(3001);
}
bootstrap();