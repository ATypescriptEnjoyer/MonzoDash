import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AuthService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should contain "Record Created ID:"', () => {
      expect(appController.getHello()).toContain('Record Created ID:');
    });
  });
});
