import { Test, TestingModule } from '@nestjs/testing';
import { TransferToPlayerHistoryService } from './transfer-to-player-history.service';

describe('TransferToPlayerHistoryService', () => {
  let service: TransferToPlayerHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferToPlayerHistoryService],
    }).compile();

    service = module.get<TransferToPlayerHistoryService>(
      TransferToPlayerHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
