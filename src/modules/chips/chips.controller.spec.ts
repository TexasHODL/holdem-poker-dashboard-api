import { Test, TestingModule } from '@nestjs/testing';
import { ChipsController } from './chips.controller';
import { ChipsService } from './chips.service';

describe('ChipsController', () => {
  let controller: ChipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChipsController],
      providers: [ChipsService],
    }).compile();

    controller = module.get<ChipsController>(ChipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
