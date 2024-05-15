import { Test, TestingModule } from '@nestjs/testing';
import { PlayerParentHistoryService } from './player-parent-history.service';

describe('PlayerParentHistoryService', () => {
  let service: PlayerParentHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerParentHistoryService],
    }).compile();

    service = module.get<PlayerParentHistoryService>(
      PlayerParentHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
