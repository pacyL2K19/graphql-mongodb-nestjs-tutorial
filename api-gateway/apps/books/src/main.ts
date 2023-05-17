import { NestFactory } from '@nestjs/core';
import { BooksModule } from './books.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(BooksModule);
  await app.listen(process.env.BOOKS_SERVICE_PORT);
}
bootstrap();
