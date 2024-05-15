import { Test, TestingModule } from '@nestjs/testing';
import { ApproveCashoutRequestService } from './approve-cashout-request.service';

describe('ApproveCashoutRequestService', () => {
  let service: ApproveCashoutRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApproveCashoutRequestService],
    }).compile();

    service = module.get<ApproveCashoutRequestService>(
      ApproveCashoutRequestService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
