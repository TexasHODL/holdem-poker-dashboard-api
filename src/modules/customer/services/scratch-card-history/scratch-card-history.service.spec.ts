import { Test, TestingModule } from '@nestjs/testing';
import { ScratchCardHistoryService } from './scratch-card-history.service';

describe('ScratchCardHistoryService', () => {
  let service: ScratchCardHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScratchCardHistoryService],
    }).compile();

    service = module.get<ScratchCardHistoryService>(ScratchCardHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
