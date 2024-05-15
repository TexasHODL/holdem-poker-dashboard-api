import { Test, TestingModule } from '@nestjs/testing';
import { FundrakeService } from './fundrake.service';

describe('FundrakeService', () => {
  let service: FundrakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundrakeService],
    }).compile();

    service = module.get<FundrakeService>(FundrakeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
