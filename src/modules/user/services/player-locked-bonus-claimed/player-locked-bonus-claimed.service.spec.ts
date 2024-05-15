import { Test, TestingModule } from '@nestjs/testing';
import { PlayerLockedBonusClaimedService } from './player-locked-bonus-claimed.service';

describe('PlayerLockedBonusClaimedService', () => {
  let service: PlayerLockedBonusClaimedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerLockedBonusClaimedService],
    }).compile();

    service = module.get<PlayerLockedBonusClaimedService>(
      PlayerLockedBonusClaimedService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
