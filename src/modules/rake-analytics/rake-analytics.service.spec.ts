import { Test, TestingModule } from '@nestjs/testing';
import { RakeAnalyticsService } from './rake-analytics.service';

describe('RakeAnalyticsService', () => {
  let service: RakeAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RakeAnalyticsService],
    }).compile();

    service = module.get<RakeAnalyticsService>(RakeAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
