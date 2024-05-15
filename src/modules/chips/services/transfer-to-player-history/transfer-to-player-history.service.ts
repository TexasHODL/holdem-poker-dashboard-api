import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class TransferToPlayerHistoryService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.ChipstransferToPlayerHistory)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  saveTransferChipsPlayerHistory(query) {
    console.log("saveTransferChipsPlayerHistoryquery ", query);
    return this.model.create(query);
    // console.log("inside saveTransferChipsPlayerHistory db query --", query);
    // mongodb.adminDb.collection('chipstransferToPlayerHistory').insert(query, function (err, result) {
    //   console.log("err, result====", err, result);
    //   cb(err, result);
    // });
  }

  findTransferToPlayerHistory(query) {
    console.log('inside findTransferToPlayerHistory db query -- ', query);
    const skip = query.skip;
    const limit = query.limit;
    const filter: any = {};
    if (query.transferTo && query.transferTo != '') {
      filter.transferTo = query.transferTo;
    }
    if (query.transferBy && query.transferBy != '') {
      filter.transferBy = query.transferBy;
    }
    if (query.transactionType && query.transactionType != '') {
      filter.transactionType = query.transactionType;
    }
    if (query.startTime && query.endTime) {
      filter.date = { $gte: new Date(query.startTime), $lte: new Date(query.endTime) };
    }
    if (query.startTime && !query.endTime) {
      filter.date = { $gte: new Date(query.endTime) };
    }
    if (!query.startTime && query.endTime) {
      filter.date = { $lte: new Date(query.endTime) };
    }
    if (query.role.level > 0) {
      console.log('line 686 ', filter);
      return this.model.find(filter).skip(skip).limit(limit).sort({ date: -1 });
    } else {
      let query2: any = {};
      if (query.userName) {
        query2.transferBy = query.userName;
      }
      // const query2: any = {
      //   transferBy: query.userName,
      // };
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
        query2.date = { $gte: new Date(query.startTime), $lte: new Date(query.endTime) };
      }
      if (query.startTime && !query.endTime) {
        query2.date = { $gte: new Date(query.startTime) };
      }
      if (!query.startTime && query.endTime) {
        query2.date = { $lte: new Date(query.endTime) };
      }

      console.log('line 706 ', query2);
      return this.model.find(query2).skip(skip).limit(limit).sort({ date: -1 });
    }
  }

  calculateTransferAmount(query) {
    console.log('inside calculateTransferAmount', query);
    const filter: any = {};
    if (query.transferTo && query.transferTo != '') {
      filter.transferTo = query.transferTo;
    }
    if (query.transferBy && query.transferBy != '') {
      filter.transferBy = query.transferBy;
    }
    if (query.transactionType && query.transactionType != '') {
      filter.transactionType = query.transactionType;
    }
    if (query.startTime && query.endTime) {
      filter.date = { $gte: new Date(query.startTime), $lte: new Date(query.endTime) };
    }
    if (query.startTime && !query.endTime) {
      filter.date = { $gte: new Date(query.endTime) };
    }
    if (!query.startTime && query.endTime) {
      filter.date = { $lte: new Date(query.endTime) };
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
      // const query2: any = {
      //   transferBy: query.userName,
      // };
      let query2: any = {};
      if (query.userName) {
        query2.transferBy = query.userName;
      }
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
        query2.date = { $gte: new Date(query.startTime), $lte: new Date(query.endTime) };
      }
      if (query.startTime && !query.endTime) {
        query2.date = { $gte: new Date(query.endTime) };
      }
      if (!query.startTime && query.endTime) {
        query2.date = { $lte: new Date(query.endTime) };
      }
      console.log('db query2 calculateTransferAmount', query2);
      return this.model
        .aggregate([
          { $match: query2 },
          { $group: { _id: '_id', totalAmount: { $sum: '$amount' } } },
        ])
        .exec();
    }
  };

  findFundTransferToPlayerByLevel(query) {
    return this.model.aggregate([
      { $group: { _id: '$role.level', amount: { $sum: '$amount' } } },
    ]);
  }

  findFundTransferToPlayerByAgent(query) {
    console.log('Inside findFundTransferToPlayerByAgent db query -->', query);
    return this.model.aggregate([
      { $match: query },
      {
        $group: { _id: '_id', amountTransferredToPlayer: { $sum: '$amount' } },
      },
    ]);
  }

  // countPlayerHistory = function (req, res) {
  //   console.log('Inside countPlayerHistory ********', JSON.stringify(req.body));
  //   if(req.body.transferTo){
  //     req.body.transferTo = eval('/'+ req.body.transferTo +'/i');
  //   }
  //   if(req.body.transferBy){
  //     req.body.transferBy = eval('/'+ req.body.transferBy +'/i');
  //   }

  //   delete req.body.skip;
  //   delete req.body.limit;
  //   admindb.countPlayerHistory(req.body, function (err, result) {
  //     if (err) {
  //       console.log('In error !!!!!!!!');
  //       return res.json({success: false, result: err});
  //     } else {
  //       console.log('Successfully found the  countPlayerHistory', JSON.stringify(result));
  //       return res.json({success: true, result: result});
  //     }
  //   });
  // }

  countPlayerHistory(query) {
    console.log('inside countPlayerHistory db query -- ', query);
    var filter: any = {};
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
      filter.date = { $gte: new Date(query.startTime), $lte: new Date(query.endTime) };
    }
    if (query.startTime && !query.endTime) {
      filter.date = { $gte: new Date(query.endTime) };
    }
    if (!query.startTime && query.endTime) {
      filter.date = { $lte: new Date(query.endTime) };
    }
    if (query.role.level > 0) {
      return this.model.count(filter);
      // mongodb.adminDb.collection('chipstransferToPlayerHistory').count(filter, function (err, result) {
      //   console.log("result in countPlayerHistory  ", JSON.stringify(result));
      //   cb(err, result);
      // });
    } else {
      // var query2: any = {
      //   transferBy: query.userName,
      // };
      var query2: any = {};
      if (!!query.userName) {
        query2.transferBy = query.userName;
      }
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
        query2.date = { $gte: new Date(query.startTime), $lte: new Date(query.endTime) };
      }
      if (query.startTime && !query.endTime) {
        query2.date = { $gte: new Date(query.endTime) };
      }
      if (!query.startTime && query.endTime) {
        query2.date = { $lte: new Date(query.endTime) };
      }
      return this.model.count(query2);
      // mongodb.adminDb.collection('chipstransferToPlayerHistory').count(query2, function (err, result) {
      //   console.log("result in countPlayerHistory  ", JSON.stringify(result));
      //   cb(err, result);
      // });
    }
  }
}
