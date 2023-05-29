import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ({
        uri: ConfigService.get('MONGODB_URI'),
        // uri: 'mongodb://localhost:27018/auth',
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 75000,
        family: 4,
        ignoreUndefined: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
