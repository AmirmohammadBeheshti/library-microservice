import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'apps/auth/src/users/users.module';
import { DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot({
      uri: 'mongodb://localhost:27018/auth',
    }),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
