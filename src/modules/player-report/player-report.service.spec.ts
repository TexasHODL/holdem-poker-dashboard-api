import { Test, TestingModule } from '@nestjs/testing';
import { PlayerReportService } from './player-report.service';

describe('PlayerReportService', () => {
  let service: PlayerReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerReportService],
    }).compile();

    service = module.get<PlayerReportService>(PlayerReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
