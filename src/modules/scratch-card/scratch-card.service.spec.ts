import { Test, TestingModule } from '@nestjs/testing';
import { ScratchCardService } from './scratch-card.service';

describe('ScratchCardService', () => {
  let service: ScratchCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScratchCardService],
    }).compile();

    service = module.get<ScratchCardService>(ScratchCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
