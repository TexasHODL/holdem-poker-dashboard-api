import { Test, TestingModule } from '@nestjs/testing';
import { SpamWordController } from './spam-word.controller';
import { SpamWordService } from './spam-word.service';

describe('SpamWordController', () => {
  let controller: SpamWordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpamWordController],
      providers: [SpamWordService],
    }).compile();

    controller = module.get<SpamWordController>(SpamWordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
