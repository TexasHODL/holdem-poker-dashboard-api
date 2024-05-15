import { Test, TestingModule } from '@nestjs/testing';
import { RakeAnalyticsController } from './rake-analytics.controller';
import { RakeAnalyticsService } from './rake-analytics.service';

describe('RakeAnalyticsController', () => {
  let controller: RakeAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RakeAnalyticsController],
      providers: [RakeAnalyticsService],
    }).compile();

    controller = module.get<RakeAnalyticsController>(RakeAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
