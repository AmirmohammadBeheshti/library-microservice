import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/books/.env',
      validationSchema: joi.object({
        MONGODB_URI: joi.string().required(),
      }),
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
