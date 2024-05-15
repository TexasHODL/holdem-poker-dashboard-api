import { Test, TestingModule } from '@nestjs/testing';
import { ChipsService } from './chips.service';

describe('ChipsService', () => {
  let service: ChipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChipsService],
    }).compile();

    service = module.get<ChipsService>(ChipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
