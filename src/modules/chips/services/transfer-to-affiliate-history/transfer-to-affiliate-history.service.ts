import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class TransferToAffiliateHistoryService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.ChipsTransferToAffiliateHistory)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  saveTransferChipsAffiliateHistory(query) {
    console.log('inside saveTransferChipsAffiliateHistory db query --', query);
    return this.create(query);
  }

  findTransferToAffiliateHistory(query) {
    console.log('inside findTransferToAffiliateHistory db query -- ', query);
    const skip = query.skip;
    const limit = query.limit;
    console.log('inside findTransferToAffiliateHistory db query ');
    const filter: any = {};
    if (!!query.transferTo && query.transferTo != '') {
      filter.transferTo = query.transferTo;
    }
    if (!!query.transferBy && query.transferBy != '') {
      filter.transferBy = query.transferBy;
    }
    if (!!query.transactionType && query.transactionType != '') {
      filter.transactionType = query.transactionType;
    }
    if (query.startTime && query.endTime) {
      filter.date = { $gte: new Date(query.startTime).getTime(), $lte: new Date(query.endTime).getTime() };
    }
    if (query.startTime && !query.endTime) {
      filter.date = { $gte: new Date(query.startTime).getTime() };
    }
    if (!query.startTime && query.endTime) {
      filter.date = { $lte: new Date(query.endTime).getTime() };
    }
    if (query.usersType && query.usersType == 'Affiliates') {
      filter['loginType.level'] = 0;
    }
    if (query.usersType && query.usersType == 'Sub-affiliates') {
      filter['loginType.level'] = -1;
    }
    if (query.role.level > 0) {
      console.log("filter=== ", filter);
      return this.model.find(filter).skip(skip).limit(limit).sort({ date: -1 });
    } else {
      const query2: any = {
        $or: [{ transferTo: query.userName }, { transferBy: query.userName }],
      };
      if (!!query.transferTo && query.transferTo != '') {
        query2.transferTo = query.transferTo;
      }
      if (!!query.transferBy && query.transferBy != '') {
        query2.transferBy = query.transferBy;
      }
      if (!!query.transactionType && query.transactionType != '') {
        query2.transactionType = query.transactionType;
      }
      if (query.startTime && query.endTime) {
        filter.date = { $gte: new Date(query.startTime), $lte: new Date(query.endTime) };
      }
      if (query.startTime && !query.endTime) {
        filter.date = { $gte: new Date(query.startTime) };
      }
      if (!query.startTime && query.endTime) {
        filter.date = { $lte: new Date(query.endTime) };
      }
      if (query.usersType && query.usersType == 'Affiliates') {
        query2['loginType.level'] = 0;
      }
      if (query.usersType && query.usersType == 'Sub-affiliates') {
        query2['loginType.level'] = -1;
      }
      return this.model.find(query2).skip(skip).limit(limit).sort({ date: -1 });
    }
  }

  calculateTransferAmountAgent(query) {
    console.log('inside calculateTransferAmount', query);
    const filter: any = {};
    if (!!query.transferTo && query.transferTo != '') {
      filter.transferTo = query.transferTo;
    }
    if (!!query.transferBy && query.transferBy != '') {
      filter.transferBy = query.transferBy;
    }
    if (!!query.transactionType && query.transactionType != '') {
      filter.transactionType = query.transactionType;
    }
    if (query.startTime && query.endTime) {
      filter.date = { $gte: new Date(query.startTime).getTime(), $lte: new Date(query.endTime).getTime() };
    }
    if (query.startTime && !query.endTime) {
      filter.date = { $gte: new Date(query.startTime).getTime() };
    }
    if (!query.startTime && query.endTime) {
      filter.date = { $lte: new Date(query.endTime).getTime() };
    }
    if (query.usersType && query.usersType == 'Affiliates') {
      filter['loginType.level'] = 0;
    }
    if (query.usersType && query.usersType == 'Sub-affiliates') {
      filter['loginType.level'] = -1;
    }
    console.log('db query1 calculateTransferAmount', filter);
    if (query.role.level > 0) {
      return this.model
        .aggregate([
          { $match: filter },
          { $group: { _id: '_id', totalAmount: { $sum: '$amount' } } },
        ])
        .exec();
    } else {
      const query2: any = {
        $or: [{ transferTo: query.userName }, { transferBy: query.userName }],
      };
      if (!!query.transferTo && query.transferTo != '') {
        query2.transferTo = query.transferTo;
      }
      if (!!query.transferBy && query.transferBy != '') {
        query2.transferBy = query.transferBy;
      }
      if (!!query.transactionType && query.transactionType != '') {
        query2.transactionType = query.transactionType;
      }
      if (query.startTime && query.endTime) {
        filter.date = { $gte: new Date(query.startTime).getTime(), $lte: new Date(query.endTime).getTime() };
      }
      if (query.startTime && !query.endTime) {
        filter.date = { $gte: new Date(query.startTime).getTime() };
      }
      if (!query.startTime && query.endTime) {
        filter.date = { $lte: new Date(query.endTime).getTime() };
      }
      if (query.usersType && query.usersType == 'Affiliates') {
        query2['loginType.level'] = 0;
      }
      if (query.usersType && query.usersType == 'Sub-affiliates') {
        query2['loginType.level'] = -1;
      }
      console.log('db query2 chipsTransferToAffiliateHistory', query2);
      return this.model
        .aggregate([
          { $match: query2 },
          { $group: { _id: '_id', totalAmount: { $sum: '$amount' } } },
        ])
        .exec();
    }
  }

  findTotalFundTransferToAgent(query) {
    console.log('Inside findTotalFundTransferToAgent db query -->', query);
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '_id',
          totalAmountTransferredToAgent: { $sum: '$amount' },
        },
      },
    ]);
  }

  countAffiliatesHistory(query) {
    console.log('inside countAffiliatesHistory db query -- ', query);
    const filter: any = {};
    if (!!query.transferTo && query.transferTo != '') {
      filter.transferTo = query.transferTo;
    }
    if (!!query.transferBy && query.transferBy != '') {
      filter.transferBy = query.transferBy;
    }
    if (!!query.transactionType && query.transactionType != '') {
      filter.transactionType = query.transactionType;
    }
    if (query.startTime && query.endTime) {
      filter.date = { $gte: new Date(query.startTime).getTime(), $lte: new Date(query.endTime).getTime() };
    }
    if (query.startTime && !query.endTime) {
      filter.date = { $gte: new Date(query.endTime).getTime() };
    }
    if (!query.startTime && query.endTime) {
      filter.date = { $lte: new Date(query.endTime).getTime() };
    }
    if (query.usersType && query.usersType == 'Affiliates') {
      filter['loginType.level'] = 0;
    }
    if (query.usersType && query.usersType == 'Sub-affiliates') {
      filter['loginType.level'] = -1;
    }
    if (query.role.level > 0) {
      return this.model.count(filter);
    } else {
      const query2: any = {
        $or: [{ transferTo: query.userName }, { transferBy: query.userName }],
      };
      if (!!query.transferTo && query.transferTo != '') {
        query2.transferTo = query.transferTo;
      }
      if (!!query.transferBy && query.transferBy != '') {
        query2.transferBy = query.transferBy;
      }
      if (!!query.transactionType && query.transactionType != '') {
        query2.transactionType = query.transactionType;
      }
      if (query.startTime && query.endTime) {
        filter.date = { $gte: new Date(query.startTime).getTime(), $lte: new Date(query.endTime).getTime() };
      }
      if (query.startTime && !query.endTime) {
        filter.date = { $gte: new Date(query.startTime).getTime() };
      }
      if (!query.startTime && query.endTime) {
        filter.date = { $lte: new Date(query.endTime).getTime() };
      }
      if (query.usersType && query.usersType == 'Affiliates') {
        query2['loginType.level'] = 0;
      }
      if (query.usersType && query.usersType == 'Sub-affiliates') {
        query2['loginType.level'] = -1;
      }
      return this.model.count(query2);
    }
  }
}
