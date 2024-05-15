import { Test, TestingModule } from '@nestjs/testing';
import { PalyerBankDetailsController } from './palyer-bank-details.controller';
import { PalyerBankDetailsService } from './palyer-bank-details.service';

describe('PalyerBankDetailsController', () => {
  let controller: PalyerBankDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PalyerBankDetailsController],
      providers: [PalyerBankDetailsService],
    }).compile();

    controller = module.get<PalyerBankDetailsController>(PalyerBankDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
