import { Test, TestingModule } from '@nestjs/testing';
import { ChipsReportService } from './chips-report.service';

describe('ChipsReportService', () => {
  let service: ChipsReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChipsReportService],
    }).compile();

    service = module.get<ChipsReportService>(ChipsReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
