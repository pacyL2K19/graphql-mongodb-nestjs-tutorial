import { NestFactory } from '@nestjs/core';
import { AuthorsModule } from './authors.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthorsModule);
  await app.listen(3000);
}
bootstrap();
