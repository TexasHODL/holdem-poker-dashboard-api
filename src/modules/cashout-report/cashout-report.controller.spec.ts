import { Test, TestingModule } from '@nestjs/testing';
import { CashoutReportController } from './cashout-report.controller';
import { CashoutReportService } from './cashout-report.service';

describe('CashoutReportController', () => {
  let controller: CashoutReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashoutReportController],
      providers: [CashoutReportService],
    }).compile();

    controller = module.get<CashoutReportController>(CashoutReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
