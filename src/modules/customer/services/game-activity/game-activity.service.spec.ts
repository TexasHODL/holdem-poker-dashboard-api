import { Test, TestingModule } from '@nestjs/testing';
import { GameActivityService } from './game-activity.service';

describe('GameActivityService', () => {
  let service: GameActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameActivityService],
    }).compile();

    service = module.get<GameActivityService>(GameActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
