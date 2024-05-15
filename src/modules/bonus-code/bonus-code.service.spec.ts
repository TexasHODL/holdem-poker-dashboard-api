import { Test, TestingModule } from '@nestjs/testing';
import { BonusCodeService } from './bonus-code.service';

describe('BonusCodeService', () => {
  let service: BonusCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonusCodeService],
    }).compile();

    service = module.get<BonusCodeService>(BonusCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
