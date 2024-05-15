import { Test, TestingModule } from '@nestjs/testing';
import { ChipsTransferService } from './chips-transfer.service';

describe('ChipsTransferService', () => {
  let service: ChipsTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChipsTransferService],
    }).compile();

    service = module.get<ChipsTransferService>(ChipsTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
