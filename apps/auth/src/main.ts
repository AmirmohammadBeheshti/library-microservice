import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: configService.get('TCP_PORT') },
  });
  const config = new DocumentBuilder()
    .setTitle('auth')
    .setDescription('Library Document API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
