import { Test, TestingModule } from '@nestjs/testing';
import { PlayerArchiveService } from './player-archive.service';

describe('PlayerArchiveService', () => {
  let service: PlayerArchiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerArchiveService],
    }).compile();

    service = module.get<PlayerArchiveService>(PlayerArchiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
