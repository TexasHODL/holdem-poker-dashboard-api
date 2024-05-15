import { Test, TestingModule } from '@nestjs/testing';
import { BonusCodeController } from './bonus-code.controller';
import { BonusCodeService } from './bonus-code.service';

describe('BonusCodeController', () => {
  let controller: BonusCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonusCodeController],
      providers: [BonusCodeService],
    }).compile();

    controller = module.get<BonusCodeController>(BonusCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
