import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledExpiryService } from './scheduled-expiry.service';

describe('ScheduledExpiryService', () => {
  let service: ScheduledExpiryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledExpiryService],
    }).compile();

    service = module.get<ScheduledExpiryService>(ScheduledExpiryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
