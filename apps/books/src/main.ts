import { NestFactory } from '@nestjs/core';
import { BooksModule } from './books.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { BOOKS_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BooksModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RMQ_URL')],
      queue: BOOKS_SERVICE,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(8000);
}
bootstrap();
