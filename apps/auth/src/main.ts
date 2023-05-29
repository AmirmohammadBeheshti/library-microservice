import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 1000 },
  });

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
