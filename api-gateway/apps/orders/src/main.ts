import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(OrdersModule);
  await app.listen(process.env.ORDER_SERVICE_PORT);
}
bootstrap();
