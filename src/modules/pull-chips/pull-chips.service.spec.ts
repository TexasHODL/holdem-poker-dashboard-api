import { Test, TestingModule } from '@nestjs/testing';
import { PullChipsService } from './pull-chips.service';

describe('PullChipsService', () => {
  let service: PullChipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PullChipsService],
    }).compile();

    service = module.get<PullChipsService>(PullChipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
