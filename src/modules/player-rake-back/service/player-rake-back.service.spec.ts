import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRakeBackService } from './player-rake-back.service';

describe('PlayerRakeBackService', () => {
  let service: PlayerRakeBackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerRakeBackService],
    }).compile();

    service = module.get<PlayerRakeBackService>(PlayerRakeBackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
