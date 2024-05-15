import { Test, TestingModule } from '@nestjs/testing';
import { PlayerLockedBonusInfoService } from './player-locked-bonus-info.service';

describe('PlayerLockedBonusInfoService', () => {
  let service: PlayerLockedBonusInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerLockedBonusInfoService],
    }).compile();

    service = module.get<PlayerLockedBonusInfoService>(
      PlayerLockedBonusInfoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
