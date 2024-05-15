import { CrudService } from '@/core/services/crud/crud.service';
import { LogDBModel } from '@/database/connections/constants';
import { InjectLogModel } from '@/database/connections/log-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PlayerArchiveService extends CrudService {
  constructor(
    @InjectLogModel(LogDBModel.PlayerArchive)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }
}
