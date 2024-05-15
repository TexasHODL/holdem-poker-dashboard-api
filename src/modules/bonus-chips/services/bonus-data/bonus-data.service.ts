import { CrudService } from '@/core/services/crud/crud.service';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class BonusDataService extends CrudService<any> {
  constructor(
    @InjectDBModel(DBModel.BonusData)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  updateBounsDataSetKeys(query, updateKeys) {
    return this.model.findOneAndUpdate(query, { $set: updateKeys });
  }
}
