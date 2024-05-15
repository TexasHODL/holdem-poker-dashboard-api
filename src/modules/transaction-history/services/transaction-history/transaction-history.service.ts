import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class TransactionHistoryService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.TransactionHistory)
    protected model: Model<any>,
    @InjectAdminModel(AdminDBModel.Deposit)
    protected depositModel: Model<any>,
  ) {
    super(model);
  }

  getTotalOnlineTransfer(query) {
    console.log('Inside getTotalOnlineTransfer db query -->', query);
    return this.model.aggregate([
      { $match: query },
      { $group: { _id: '_id', totalOnlineTransfer: { $sum: '$amount' } } },
    ]);
  }
}
