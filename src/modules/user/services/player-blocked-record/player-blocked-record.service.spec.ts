import { Test, TestingModule } from '@nestjs/testing';
import { PlayerBlockedRecordService } from './player-blocked-record.service';

describe('PlayerBlockedRecordService', () => {
  let service: PlayerBlockedRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerBlockedRecordService],
    }).compile();

    service = module.get<PlayerBlockedRecordService>(
      PlayerBlockedRecordService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
