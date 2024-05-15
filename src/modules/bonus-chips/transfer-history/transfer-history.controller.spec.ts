import { Test, TestingModule } from '@nestjs/testing';
import { TransferHistoryController } from './transfer-history.controller';

describe('TransferHistoryController', () => {
  let controller: TransferHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferHistoryController],
    }).compile();

    controller = module.get<TransferHistoryController>(
      TransferHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
