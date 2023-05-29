import { NestFactory } from '@nestjs/core';
import { TestModule } from './test.module';

async function bootstrap() {
  const app = await NestFactory.create(TestModule);
  await app.listen(9000);
}
bootstrap();
