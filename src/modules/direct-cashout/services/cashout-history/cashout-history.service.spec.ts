import { Test, TestingModule } from '@nestjs/testing';
import { CashoutHistoryService } from './cashout-history.service';

describe('CashoutHistoryService', () => {
  let service: CashoutHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashoutHistoryService],
    }).compile();

    service = module.get<CashoutHistoryService>(CashoutHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
