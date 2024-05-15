import { Test, TestingModule } from '@nestjs/testing';
import { DirectCashoutService } from './direct-cashout.service';

describe('DirectCashoutService', () => {
  let service: DirectCashoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectCashoutService],
    }).compile();

    service = module.get<DirectCashoutService>(DirectCashoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
