import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointService } from './loyalty-point.service';

describe('LoyaltyPointService', () => {
  let service: LoyaltyPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyaltyPointService],
    }).compile();

    service = module.get<LoyaltyPointService>(LoyaltyPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
