import { Test, TestingModule } from '@nestjs/testing';
import { CashoutReportService } from './cashout-report.service';

describe('CashoutReportService', () => {
  let service: CashoutReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashoutReportService],
    }).compile();

    service = module.get<CashoutReportService>(CashoutReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
