import { Test, TestingModule } from '@nestjs/testing';
import { BalanceSheetManagementService } from './balance-sheet.service';

describe('BalanceSheetService', () => {
  let service: BalanceSheetManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceSheetManagementService],
    }).compile();

    service = module.get<BalanceSheetManagementService>(
      BalanceSheetManagementService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
