import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardReportService } from './leaderboard-report.service';

describe('LeaderboardReportService', () => {
  let service: LeaderboardReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaderboardReportService],
    }).compile();

    service = module.get<LeaderboardReportService>(LeaderboardReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
