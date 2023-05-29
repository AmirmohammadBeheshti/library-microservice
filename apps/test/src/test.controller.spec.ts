import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from './test.controller';
import { TestService } from './test.service';

describe('TestController', () => {
  let testController: TestController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [TestService],
    }).compile();

    testController = app.get<TestController>(TestController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(testController.getHello()).toBe('Hello World!');
    });
  });
});
