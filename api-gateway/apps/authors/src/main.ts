import { NestFactory } from '@nestjs/core';
import { AuthorsModule } from './authors.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AuthorsModule);
  await app.listen(process.env.AUTHOR_SERVICE_PORT);
}
bootstrap();
