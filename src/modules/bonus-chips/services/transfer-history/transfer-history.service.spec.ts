import { Test, TestingModule } from '@nestjs/testing';
import { TransferHistoryService } from './transfer-history.service';

describe('TransferHistoryService', () => {
  let service: TransferHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferHistoryService],
    }).compile();

    service = module.get<TransferHistoryService>(TransferHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
