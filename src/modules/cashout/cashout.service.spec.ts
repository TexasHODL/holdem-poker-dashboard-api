import { Test, TestingModule } from '@nestjs/testing';
import { CashoutService } from './cashout.service';

describe('CashoutService', () => {
  let service: CashoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashoutService],
    }).compile();

    service = module.get<CashoutService>(CashoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
