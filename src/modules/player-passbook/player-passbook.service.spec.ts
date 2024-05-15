import { Test, TestingModule } from '@nestjs/testing';
import { PlayerPassbookService } from './player-passbook.service';

describe('PlayerPassbookService', () => {
  let service: PlayerPassbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerPassbookService],
    }).compile();

    service = module.get<PlayerPassbookService>(PlayerPassbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
