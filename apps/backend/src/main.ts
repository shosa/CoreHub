import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS per permettere al frontend di chiamare l'API
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost'],
    credentials: true,
  });

  // Prefix per le API
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('🚀 CoreHub Backend running on http://localhost:3001');
}

bootstrap();
