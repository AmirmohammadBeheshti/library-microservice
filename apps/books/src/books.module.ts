import { CacheModule, Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { AUTH_SERVICE, DatabaseModule, RmqService } from '@app/common';
import { ClientsModule, RedisOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GenreModule } from './genre/genre.module';
import { BooksRepository } from './books.repository';
import { BooksSerializer } from './books.serializer';
import { Books, BooksSchema } from './schema/books.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Books.name, schema: BooksSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/books/.env',
      validationSchema: joi.object({
        MONGODB_URI: joi.string().required(),
        RMQ_URL: joi.string().required(),
      }),
    }),
    GenreModule,
    CacheModule.register({
      isGlobal: true,
      port: 6379,
      ttl: 0,
      host: 'redis',
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository, BooksSerializer, RmqService],
})
export class BooksModule {}
