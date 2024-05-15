import { Test, TestingModule } from '@nestjs/testing';
import { CashoutAffiliateService } from './cashout-affiliate.service';

describe('CashoutAffiliateService', () => {
  let service: CashoutAffiliateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashoutAffiliateService],
    }).compile();

    service = module.get<CashoutAffiliateService>(CashoutAffiliateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
