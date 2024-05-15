import { Test, TestingModule } from '@nestjs/testing';
import { DirectCashoutHistoryService } from './direct-cashout-history.service';

describe('DirectCashoutHistoryService', () => {
  let service: DirectCashoutHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectCashoutHistoryService],
    }).compile();

    service = module.get<DirectCashoutHistoryService>(
      DirectCashoutHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
