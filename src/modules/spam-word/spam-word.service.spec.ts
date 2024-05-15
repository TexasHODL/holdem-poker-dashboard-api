import { Test, TestingModule } from '@nestjs/testing';
import { SpamWordService } from './spam-word.service';

describe('SpamWordService', () => {
  let service: SpamWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpamWordService],
    }).compile();

    service = module.get<SpamWordService>(SpamWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
