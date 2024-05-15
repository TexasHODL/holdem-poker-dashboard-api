import { Test, TestingModule } from '@nestjs/testing';
import { TableJoinRecordService } from './table-join-record.service';

describe('TableJoinRecordService', () => {
  let service: TableJoinRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableJoinRecordService],
    }).compile();

    service = module.get<TableJoinRecordService>(TableJoinRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
