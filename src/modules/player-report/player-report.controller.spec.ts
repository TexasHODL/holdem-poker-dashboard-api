import { Test, TestingModule } from '@nestjs/testing';
import { PlayerReportController } from './player-report.controller';
import { PlayerReportService } from './player-report.service';

describe('PlayerReportController', () => {
  let controller: PlayerReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerReportController],
      providers: [PlayerReportService],
    }).compile();

    controller = module.get<PlayerReportController>(PlayerReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
