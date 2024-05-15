import { CrudService } from '@/core/services/crud/crud.service';
import { LogDBModel } from '@/database/connections/constants';
import { InjectLogModel } from '@/database/connections/log-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PlayerBlockedRecordService extends CrudService {
  constructor(
    @InjectLogModel(LogDBModel.PlayerBlockedRecord)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  insertBlockedPlayerData(dto: any) {
    console.log("dto: ", dto);
    return this.model.create(dto);
  }
}
