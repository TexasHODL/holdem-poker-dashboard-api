import { Test, TestingModule } from '@nestjs/testing';
import { PlayerHandHistoryService } from './player-hand-history.service';

describe('PlayerHandHistoryService', () => {
  let service: PlayerHandHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerHandHistoryService],
    }).compile();

    service = module.get<PlayerHandHistoryService>(PlayerHandHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
