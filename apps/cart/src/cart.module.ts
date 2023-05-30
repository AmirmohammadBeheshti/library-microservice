import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { BOOKS_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as joi from 'joi';
import { CartSerializer } from './cart.serializer';
import { CartRepository } from './cart.repository';
import { Cart, CartSchema } from './schema/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/cart/.env',
      validationSchema: joi.object({
        MONGODB_URI: joi.string().required(),
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
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, CartSerializer, CartRepository],
})
export class CartModule {}
