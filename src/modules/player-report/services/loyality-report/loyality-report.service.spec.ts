import { Test, TestingModule } from '@nestjs/testing';
import { LoyalityReportService } from './loyality-report.service';

describe('LoyalityReportService', () => {
  let service: LoyalityReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyalityReportService],
    }).compile();

    service = module.get<LoyalityReportService>(LoyalityReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
