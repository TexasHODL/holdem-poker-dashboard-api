import { Test, TestingModule } from '@nestjs/testing';
import { CashoutController } from './cashout.controller';
import { CashoutService } from './cashout.service';

describe('CashoutController', () => {
  let controller: CashoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashoutController],
      providers: [CashoutService],
    }).compile();

    controller = module.get<CashoutController>(CashoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
