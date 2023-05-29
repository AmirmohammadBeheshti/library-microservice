import { Module } from '@nestjs/common';
import { HttpGatewayController } from './http-gateway.controller';
import { HttpGatewayService } from './http-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_SERVICE, BOOKS_SERVICE, CART_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './Auth/users.controller';
import { CartController } from './cart/cart.controller';
import { BooksController } from './books/books.controller';
import * as joi from 'joi';
import { AuthController } from './auth/auth.controller';
@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/cart/.env',
      validationSchema: joi.object({
        AUTH_HOST: joi.string().required(),
        AUTH_PORT: joi.number().required(),
        RMQ_URL: joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: BOOKS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RMQ_URL').toString()],
            queue: BOOKS_SERVICE,
            queueOptions: {
              durable: false,
            },
            noAck: false,
            persistent: true,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: CART_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RMQ_URL').toString()],
            queue: CART_SERVICE,
            queueOptions: {
              durable: false,
            },
            noAck: false,
            persistent: true,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    HttpGatewayController,
    UsersController,
    CartController,
    BooksController,
    AuthController,
  ],
  providers: [HttpGatewayService],
})
export class HttpGatewayModule {}
