import { Test, TestingModule } from '@nestjs/testing';
import { CashoutAffiliateController } from './cashout-affiliate.controller';
import { CashoutAffiliateService } from './cashout-affiliate.service';

describe('CashoutAffiliateController', () => {
  let controller: CashoutAffiliateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashoutAffiliateController],
      providers: [CashoutAffiliateService],
    }).compile();

    controller = module.get<CashoutAffiliateController>(CashoutAffiliateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
