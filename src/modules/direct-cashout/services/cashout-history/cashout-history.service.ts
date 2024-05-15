import { query } from 'express';
import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CashoutHistoryService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.CashoutHistory)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  getUserCashoutSuccessDetails(query, groupBy) {
    console.log("groupBy=================== ", groupBy);
    console.log('Inside getPlayerCashoutSuccessDetails db query -->', query);
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: groupBy,
          totalRequestedAmount: { $sum: '$requestedAmount' },
          totalTDS: { $sum: '$tds' },
          totalProcessingFees: { $sum: '$processingFees' },
          totalNetAmount: { $sum: '$netAmount' },
        },
      },
    ]);
  }

  getAffCashoutSuccessDetails(query) {
    console.log('Inside getAffCashoutSuccessDetails db query -->', query);
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '_id',
          totalRequestedAmount: { $sum: '$requestedAmount' },
          totalTDS: { $sum: '$tds' },
          totalProcessingFees: { $sum: '$processingFees' },
          totalNetAmount: { $sum: '$netAmount' },
        },
      },
    ]);
  }

  getTotalChipsPulledSubAgentByAdminApproved(query) {
    console.log(
      'Inside getTotalChipsPulledSubAgentByAdminApproved db query -->',
      query,
    );
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$tdsType',
          requestedAmount: { $sum: '$requestedAmount' },
        },
      },
    ]);
  }
  findFromCashoutHistory(query) {
    console.log('findFromCashoutHistory',query)
    return this.model.find(query, {
      userName: 1, requestedAt: 1,
      status: 1, requestedAmount: 1,
      tds: 1, processingFees: 1,
      netAmount: 1, referenceNo: 1,
      affiliateId: 1, transactionId: 1,
      createdAt: 1
    })
  }

  insertIntoCashoutHistory(data) {
    return this.model.create(data);
  }

  getCashoutHistoryCount(data) {
    if (data.userName) {
      data.userName = eval('/^' + data.userName + '$/i');
    }
    if (data.bankTransactionId) {
      data.transactionId = data.bankTransactionId.toString();
    }
    delete data.bankTransactionId;
    console.log("count cashout history db query------------>", data);
    return this.model.count(data);
  }

  listCashOutHistory(query) {
    var query1: any = {};
    if (query.userName) {
      query1.userName = eval('/^' + query.userName + '$/i');
    }
    if (query.referenceNo) {
      query1.referenceNo = query.referenceNo;
    }
    if (query.bankTransactionId) {
      query1.transactionId = query.bankTransactionId.toString();
    }
    if (query.createdAt) {
      query1.createdAt = query.createdAt;
    }
    if (query.status) {
      query1.status = query.status;
    }
    console.trace("i am here alone.db query..................--------->", query1);
    return this.model.find(query1).skip(query.skip).limit(query.limit).sort({ createdAt: -1 });
  }

  calculateTotalApprovedAmount(query) {
    return this.model.aggregate([{ $match: query }, { $group: { _id: "_id", amount: { $sum: '$requestedAmount' } } }]);
  }
}
