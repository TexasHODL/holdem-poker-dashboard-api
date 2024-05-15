import { CrudService } from '@/core/services/crud/crud.service';
import { InMemoryDBModel } from '@/database/connections/constants';
import { InjectInMemoryModel } from '@/database/connections/in-memory-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class TableJoinRecordService extends CrudService {
  constructor(
    @InjectInMemoryModel(InMemoryDBModel.TableJoinRecord)
    protected readonly inMemoryModel: Model<any>,
  ) {
    super(inMemoryModel);
  }
}
