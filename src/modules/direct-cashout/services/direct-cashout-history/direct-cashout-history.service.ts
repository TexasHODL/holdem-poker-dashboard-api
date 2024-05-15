import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class DirectCashoutHistoryService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.DirectCashoutHistory)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  getSubAgentApprovedCashoutsToAgent = function (query) {
    console.log(
      'Inside getSubAgentApprovedCashoutsToAgent db query -->',
      query,
    );
    return this.model.aggregate([
      { $match: query },
      { $group: { _id: '$type', amount: { $sum: '$amount' } } },
    ]);
  };

  getPlayerSucessCashoutsToAgent = function (query) {
    console.log('Inside getPlayerSucessCashoutsToAgent db query -->', query);
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '_id',
          amount: { $sum: '$amount' },
          requestedAmount: { $sum: '$requestedAmount' },
        },
      },
    ]);
  };

  async findFromDirectCashoutHistory(query){
    return this.model.find(query);
  } 
}
