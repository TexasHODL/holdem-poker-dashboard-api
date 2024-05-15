import { Test, TestingModule } from '@nestjs/testing';
import { LoyalityPlayerService } from './loyality-player.service';

describe('LoyalityPlayerService', () => {
  let service: LoyalityPlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyalityPlayerService],
    }).compile();

    service = module.get<LoyalityPlayerService>(LoyalityPlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
