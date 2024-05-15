import { Test, TestingModule } from '@nestjs/testing';
import { DailyBalanceSheetService } from './daily-balance-sheet.service';

describe('DailyBalanceSheetService', () => {
  let service: DailyBalanceSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyBalanceSheetService],
    }).compile();

    service = module.get<DailyBalanceSheetService>(DailyBalanceSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
