import { Test, TestingModule } from '@nestjs/testing';
import { BonusClaimService } from './bonus-claim.service';

describe('BonusClaimService', () => {
  let service: BonusClaimService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonusClaimService],
    }).compile();

    service = module.get<BonusClaimService>(BonusClaimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
