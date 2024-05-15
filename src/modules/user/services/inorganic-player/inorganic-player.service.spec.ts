import { Test, TestingModule } from '@nestjs/testing';
import { InorganicPlayerService } from './inorganic-player.service';

describe('InorganicPlayerService', () => {
  let service: InorganicPlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InorganicPlayerService],
    }).compile();

    service = module.get<InorganicPlayerService>(InorganicPlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
