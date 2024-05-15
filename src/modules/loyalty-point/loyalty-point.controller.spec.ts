import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointController } from './loyalty-point.controller';
import { LoyaltyPointService } from './loyalty-point.service';

describe('LoyaltyPointController', () => {
  let controller: LoyaltyPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyPointController],
      providers: [LoyaltyPointService],
    }).compile();

    controller = module.get<LoyaltyPointController>(LoyaltyPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
