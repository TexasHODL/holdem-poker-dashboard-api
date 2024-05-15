import { Test, TestingModule } from '@nestjs/testing';
import { InstantBonusHistoryService } from './instant-bonus-history.service';

describe('InstantBonusHistoryService', () => {
  let service: InstantBonusHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstantBonusHistoryService],
    }).compile();

    service = module.get<InstantBonusHistoryService>(
      InstantBonusHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
