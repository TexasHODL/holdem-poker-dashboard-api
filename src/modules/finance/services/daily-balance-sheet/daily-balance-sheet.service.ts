import { CrudService } from '@/core/services/crud/crud.service';
import { FinanceDbModel } from '@/database/connections/constants';
import { InjectFinanceModel } from '@/database/connections/finance-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class DailyBalanceSheetService extends CrudService {
  constructor(
    @InjectFinanceModel(FinanceDbModel.DailyBalanceSheet)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  insertDataInDailyBalanceSheet(data) {
    return this.model.create(data);
  }

  findAllBalanceSheetDataForDashboard(query) {
    return this.model.find(query).sort({ createdAt: -1 });
  }

  getBalanceSheetDataForDashboard(query) {
    return this.model.findOne(query).sort({ createdAt: -1 });
  }
}
