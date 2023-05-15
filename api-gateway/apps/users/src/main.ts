import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(UsersModule);
  await app.listen(process.env.USER_SERVICE_PORT);
}
bootstrap();
