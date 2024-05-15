import { Test, TestingModule } from '@nestjs/testing';
import { ChipsReportController } from './chips-report.controller';

describe('ChipsReportController', () => {
  let controller: ChipsReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChipsReportController],
    }).compile();

    controller = module.get<ChipsReportController>(ChipsReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
