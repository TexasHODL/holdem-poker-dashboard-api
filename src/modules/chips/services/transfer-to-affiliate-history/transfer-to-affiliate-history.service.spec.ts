import { Test, TestingModule } from '@nestjs/testing';
import { TransferToAffiliateHistoryService } from './transfer-to-affiliate-history.service';

describe('TransferToAffiliateHistoryService', () => {
  let service: TransferToAffiliateHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferToAffiliateHistoryService],
    }).compile();

    service = module.get<TransferToAffiliateHistoryService>(
      TransferToAffiliateHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
