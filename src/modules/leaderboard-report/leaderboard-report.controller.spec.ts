import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardReportController } from './leaderboard-report.controller';
import { LeaderboardReportService } from './leaderboard-report.service';

describe('LeaderboardReportController', () => {
  let controller: LeaderboardReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardReportController],
      providers: [LeaderboardReportService],
    }).compile();

    controller = module.get<LeaderboardReportController>(LeaderboardReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
