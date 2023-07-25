import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true // si on ajoute d'autre choses non défini au header il l'enléve
    }),
  );
  await app.listen(3000);
}
bootstrap();
