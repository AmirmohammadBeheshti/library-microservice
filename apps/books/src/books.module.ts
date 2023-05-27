import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
        AUTH_HOST: joi.string().required(),
        AUTH_PORT: joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
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
    GenreModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository, BooksSerializer],
})
export class BooksModule {}
