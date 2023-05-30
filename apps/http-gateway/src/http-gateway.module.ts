import { Module } from '@nestjs/common';
import { HttpGatewayController } from './http-gateway.controller';
import { HttpGatewayService } from './http-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AUTH_SERVICE,
  BOOKS_SERVICE,
  CART_SERVICE,
  LocalStrategy,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CartController } from './cart/cart.controller';
import { BooksController } from './books/books.controller';
import * as joi from 'joi';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './auth/users.controller';
import { GenreController } from './books/genre.cotroller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    // JwtModule.registerAsync({
    //   global: true,
    //   useFactory: (configService: ConfigService) => ({
    //     signOptions: { expiresIn: `${3600}s` },
    //     secret:
    //       '54SDDFS54FDF8ERER5ASDASEDWQ5QERTRTD2FG12W221RR5SRF54SF1GXsdf4q5erf6q',
    //   }),
    //   inject: [ConfigService],
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/cart/.env',
      validationSchema: joi.object({
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
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RMQ_URL').toString()],
            queue: AUTH_SERVICE,
            queueOptions: {
              durable: false,
            },
            noAck: false,
            persistent: true,
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
    GenreController,
  ],
  providers: [HttpGatewayService, LocalStrategy],
})
export class HttpGatewayModule {}
