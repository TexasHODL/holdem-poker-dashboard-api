import { Test, TestingModule } from '@nestjs/testing';
import { PlayerBuildAccessService } from './player-build-access.service';

describe('PlayerBuildAccessService', () => {
  let service: PlayerBuildAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerBuildAccessService],
    }).compile();

    service = module.get<PlayerBuildAccessService>(PlayerBuildAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
