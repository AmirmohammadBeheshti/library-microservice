import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CART_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RMQ_URL')],
      queue: CART_SERVICE,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(5000);
}
bootstrap();
