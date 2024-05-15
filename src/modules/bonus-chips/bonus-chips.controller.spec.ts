import { Test, TestingModule } from '@nestjs/testing';
import { BonusChipsController } from './bonus-chips.controller';

describe('BonusChipsController', () => {
  let controller: BonusChipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonusChipsController],
    }).compile();

    controller = module.get<BonusChipsController>(BonusChipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
