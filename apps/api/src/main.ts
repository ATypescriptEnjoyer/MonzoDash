import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

const { DEBUG } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api');
  await app.listen(5000);
}
bootstrap();
