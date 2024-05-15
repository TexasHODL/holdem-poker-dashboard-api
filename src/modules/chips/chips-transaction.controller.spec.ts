import { Test, TestingModule } from '@nestjs/testing';
import { ChipsTransactionController } from './chips-transaction.controller';

describe('ChipsTransactionController', () => {
  let controller: ChipsTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChipsTransactionController],
    }).compile();

    controller = module.get<ChipsTransactionController>(
      ChipsTransactionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
