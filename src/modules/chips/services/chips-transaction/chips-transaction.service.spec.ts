import { Test, TestingModule } from '@nestjs/testing';
import { ChipsTransactionService } from './chips-transaction.service';

describe('ChipsTransactionService', () => {
  let service: ChipsTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChipsTransactionService],
    }).compile();

    service = module.get<ChipsTransactionService>(ChipsTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
