import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { FinanceDbModel } from '@/database/connections/constants';
import { InjectFinanceModel } from '@/database/connections/finance-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class FundrakeService extends CrudService {
  constructor(
    @InjectFinanceModel(FinanceDbModel.Fundrake)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  findTotalRakeGenerated(query, groupBy, aggregateBy) {
    return this.model.aggregate([
      { $match: query },
      { $group: { _id: groupBy, amount: { $sum: aggregateBy } } },
    ]);
  }

  getAffOrAgentRakeGenerated(query, fieldNameToSum) {
    return this.model.aggregate([
      { $match: query },
      { $group: { _id: '_id', totalRakeGenerated: { $sum: fieldNameToSum } } },
    ]);
  }

  getUserRakeDataForBalanceSheet = function (query) {
    return this.model.aggregate([
      {
        $group: {
          _id: '_id',
          totalRake: { $sum: '$amount' },
          totalGST: { $sum: '$GST' },
          totalRakeToAdmin: { $sum: '$debitToCompany' },
          totalRakeToAffiliate: { $sum: '$debitToAffiliateamount' },
          totalRakeToSubAffiliate: { $sum: '$debitToSubaffiliateamount' },
          totalPlayerRakeBack: { $sum: '$playerRakeBack' },
        },
      },
    ]);
  };

  getRakeDataDescending(query) {
    var skip = query.skip || 0;
    var limit = query.limit || 0;
    var sortValue = query.sortValue;
    delete query.sortValue;
    delete query.skip;
    delete query.limit;
    return this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortValue]: -1 });
  }

  getRakeData(query) {
    console.log("querygetRakeData ", query);
    // var skip = query.skip || 0;
    // var limit = query.limit || 0;
    // delete query.skip;
    // delete query.limit;
    return this.model.find(query);
  }

  getRakeDataCount(query) {
    console.log('getRakeDataCount ', query);
    return this.model.count(query);
  }

  findTotalRake(query) {
    return this.model.find(query);
  }

  listRakeBackMonthlyReport(query) {
    var skip = query.skip || 0;
    var limit = query.limit || 0;
    delete query.skip;
    delete query.limit;
    console.log('query-->', query);
    return this.model
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: '$rakeByUsername',
            totalAdminRake: { $sum: '$debitToCompany' },
            totalGst: { $sum: '$GST' },
            totalAffRake: { $sum: '$debitToAffiliateamount' },
            totalSubAffRake: { $sum: '$debitToSubaffiliateamount' },
          },
        },
      ])
  }
}
