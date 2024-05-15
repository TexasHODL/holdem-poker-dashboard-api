import { Test, TestingModule } from '@nestjs/testing';
import { ChipsTransferHistoryService } from './chips-transfer-history.service';

describe('ChipsTransferHistoryService', () => {
  let service: ChipsTransferHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChipsTransferHistoryService],
    }).compile();

    service = module.get<ChipsTransferHistoryService>(
      ChipsTransferHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
