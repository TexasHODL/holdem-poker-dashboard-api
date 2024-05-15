import { Test, TestingModule } from '@nestjs/testing';
import { PalyerBankDetailsService } from './palyer-bank-details.service';

describe('PalyerBankDetailsService', () => {
  let service: PalyerBankDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PalyerBankDetailsService],
    }).compile();

    service = module.get<PalyerBankDetailsService>(PalyerBankDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
