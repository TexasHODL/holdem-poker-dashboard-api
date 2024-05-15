import { Test, TestingModule } from '@nestjs/testing';
import { PullChipsController } from './pull-chips.controller';
import { PullChipsService } from './pull-chips.service';

describe('PullChipsController', () => {
  let controller: PullChipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PullChipsController],
      providers: [PullChipsService],
    }).compile();

    controller = module.get<PullChipsController>(PullChipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
