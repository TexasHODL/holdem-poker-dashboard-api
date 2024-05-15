import { Test, TestingModule } from '@nestjs/testing';
import { BonusDataService } from './bonus-data.service';

describe('BonusDataService', () => {
  let service: BonusDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonusDataService],
    }).compile();

    service = module.get<BonusDataService>(BonusDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
