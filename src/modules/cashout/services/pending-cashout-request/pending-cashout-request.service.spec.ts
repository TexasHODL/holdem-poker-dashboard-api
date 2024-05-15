import { Test, TestingModule } from '@nestjs/testing';
import { PendingCashoutRequestService } from './pending-cashout-request.service';

describe('PendingCashoutRequestService', () => {
  let service: PendingCashoutRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingCashoutRequestService],
    }).compile();

    service = module.get<PendingCashoutRequestService>(
      PendingCashoutRequestService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
