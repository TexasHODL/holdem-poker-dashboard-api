import { CrudService } from '@/core/services/crud/crud.service';
import { InjectFinanceDBModel } from '@/database/connections/db';
import { DBModelNames } from '@/database/connections/model';
import { Injectable } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';

@Injectable()
export class BalanceSheetService extends CrudService {
  constructor(
    @InjectFinanceDBModel(DBModelNames.BalanceSheet)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  updateBalanceSheet(updateQuery: any) {
    return this.model.update({}, updateQuery).exec();
  }
}
