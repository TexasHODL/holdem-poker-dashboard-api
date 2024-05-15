import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardSetController } from './leaderboard-set.controller';
import { LeaderboardSetService } from './leaderboard-set.service';

describe('LeaderboardSetController', () => {
  let controller: LeaderboardSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardSetController],
      providers: [LeaderboardSetService],
    }).compile();

    controller = module.get<LeaderboardSetController>(LeaderboardSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
