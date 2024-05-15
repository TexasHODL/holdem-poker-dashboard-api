import { Test, TestingModule } from '@nestjs/testing';
import { DirectCashoutController } from './direct-cashout.controller';
import { DirectCashoutService } from './direct-cashout.service';

describe('DirectCashoutController', () => {
  let controller: DirectCashoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectCashoutController],
      providers: [DirectCashoutService],
    }).compile();

    controller = module.get<DirectCashoutController>(DirectCashoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
