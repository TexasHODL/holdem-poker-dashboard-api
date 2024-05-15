import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardSetService } from './leaderboard-set.service';

describe('LeaderboardSetService', () => {
  let service: LeaderboardSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaderboardSetService],
    }).compile();

    service = module.get<LeaderboardSetService>(LeaderboardSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
