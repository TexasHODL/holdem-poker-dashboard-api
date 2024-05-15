import { Test, TestingModule } from '@nestjs/testing';
import { LoyalityPlayerController } from './loyality-player.controller';
import { LoyalityPlayerService } from './loyality-player.service';

describe('LoyalityPlayerController', () => {
  let controller: LoyalityPlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyalityPlayerController],
      providers: [LoyalityPlayerService],
    }).compile();

    controller = module.get<LoyalityPlayerController>(LoyalityPlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
