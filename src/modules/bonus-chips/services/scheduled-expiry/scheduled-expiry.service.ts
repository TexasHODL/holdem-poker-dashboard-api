import { CrudService } from '@/core/services/crud/crud.service';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ScheduledExpiryService extends CrudService<any> {
  constructor(
    @InjectDBModel(DBModel.ScheduledExpiry)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }
}
