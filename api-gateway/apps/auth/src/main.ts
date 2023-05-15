import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AuthModule);
  await app.listen(process.env.AUTH_SERVICE_PORT);
}
bootstrap();
