import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHistoryReportService } from './transaction-history-report.service';

describe('TransactionHistoryReportService', () => {
  let service: TransactionHistoryReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionHistoryReportService],
    }).compile();

    service = module.get<TransactionHistoryReportService>(
      TransactionHistoryReportService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
