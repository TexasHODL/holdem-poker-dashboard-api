import { Test, TestingModule } from '@nestjs/testing';
import { ScratchCardController } from './scratch-card.controller';
import { ScratchCardService } from './scratch-card.service';

describe('ScratchCardController', () => {
  let controller: ScratchCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScratchCardController],
      providers: [ScratchCardService],
    }).compile();

    controller = module.get<ScratchCardController>(ScratchCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
