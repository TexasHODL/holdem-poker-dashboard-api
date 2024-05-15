import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CountDataInTransactionHistoryDto } from '../dto/count-data-in-transaction-history.dto';
import { ListTransactionHistoryDto } from '../dto/list-transaction-history.dto';

@Injectable()
export class TransactionHistoryReportService {
  constructor(
    @InjectAdminModel(AdminDBModel.TransactionHistory)
    protected readonly transactionHistoryModel: Model<any>,
    @InjectAdminModel(AdminDBModel.Deposit)
    protected readonly depositModel: Model<any>,
  ) {}

  async countDataInTransactionHistory(
    params: CountDataInTransactionHistoryDto,
  ) {
    console.log(
      'Inside countDataInTransactionHistory ********',
      JSON.stringify(params),
    );
    // var query = {};

    // if (req.body.loginId) {
    //     query = {
    //     loginId: eval('/^'+ req.body.loginId +'$/i'),
    //     $or: [
    //                     {status: {$exists: false}},
    //                     {status: 'SUCCESS' },
    //                     {status: 'NOT USED' }
    //     ]
    //     };
    // } else {
    //     query = {
    //     $or: [
    //                     {status: {$exists: false}},
    //                     {status: 'SUCCESS' },
    //                     {status: 'NOT USED' }
    //     ]
    //     };
    // }

    // if (req.body.Name) {
    //     query.loginId = eval('/'+ req.body.Name +'/i');
    // }
    // if (req.body.userType) {
    //     query.loginType = {'$regex' : req.body.userType , "$options" : 'i'};
    // }
    // if (req.body.bonusCode) {
    //     query.bonusCode = req.body.bonusCode;
    // }
    // if (req.body.transactionType) {
    //     query.transactionType = req.body.transactionType;
    // }
    // if (req.body.transferMode) {
    //     query.transferMode = req.body.transferMode;
    // }
    // if (req.body.referenceNumber) {
    //     query.referenceNumber = req.body.referenceNumber;
    // }
    // if (req.body.startDate && req.body.endDate){
    //     query.date = { $gte : req.body.startDate , $lte : req.body.endDate}
    // }
    // if (req.body.startDate && !req.body.endDate){
    //     query.date = { $gte : req.body.startDate};
    // }
    // if (!req.body.startDate && req.body.endDate){
    //     query.date = {$lte : req.body.endDate}
    // }
    // console.log("transactionHistory Count query",query);
    // admindb.getTransactionHistoryCount(query, function (err, result) {
    //     if (err) {
    //     console.log('In error in getTransactionHistoryCount !!!!!!!!');
    //     return res.json({success: false, result: err});
    //     } else {
    //     return res.json({success: true, result: result});
    //     }
    // });

    let query: any = {};

    if (params.loginId) {
      query = {
        loginId: eval('/^' + params.loginId + '$/i'),
        $or: [
          { status: { $exists: false } },
          { status: 'SUCCESS' },
          { status: 'NOT USED' },
        ],
      };
    } else {
      query = {
        $or: [
          { status: { $exists: false } },
          { status: 'SUCCESS' },
          { status: 'NOT USED' },
        ],
      };
    }
    if (params.Name) {
      query.loginId = eval('/' + params.Name + '/i');
    }
    if (params.userType) {
      query.loginType = { $regex: params.userType, $options: 'i' };
    }
    if (params.bonusCode) {
      query.bonusCode = params.bonusCode;
    }
    if (params.transactionType) {
      query.transactionType = params.transactionType;
    }
    if (params.transferMode) {
      query.transferMode = params.transferMode;
    }
    if (params.referenceNumber) {
      query.referenceNumber = params.referenceNumber;
    }
    if (params.startDate && params.endDate) {
      query.date = { $gte: params.startDate, $lte: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.date = { $lte: params.endDate };
    }

    console.log('transactionHistory Count query', query);
    // admindb.getTransactionHistoryCount(query, function (err, result) {
    //     if (err) {
    //     console.log('In error in getTransactionHistoryCount !!!!!!!!');
    //     return res.json({success: false, result: err});
    //     } else {
    //     return res.json({success: true, result: result});
    //     }
    // });
    return await this.getTransactonHistoryCount(query);
  }

  async getTransactonHistoryCount(query) {
    // mongodb.adminDb.collection('transactionHistory').count(query, function (err, result) {
    //   console.log(" count of transaction History.............. ", JSON.stringify(result));
    //   cb(err, result);
    // });
    return await this.transactionHistoryModel.count(query);
  }

  async getTransactionHistory(params: ListTransactionHistoryDto) {
    console.log("inside getTransactionHistory: ", params);
    const listTransaction = await this.listTransactionHistory(params);
    const assignTotalDebitAndTotalCredit =
      await this.assignTotalDebitTotalCredit(listTransaction, params);
    return {
      ...assignTotalDebitAndTotalCredit,
    };
  }

  async listTransactionHistory(params: ListTransactionHistoryDto) {
    console.log(
      'Inside listTransactionHistory ********',
      JSON.stringify(params),
    );
    let query: any = {};
    if (params.loginId) {
      query = {
        loginId: eval('/^' + params.loginId + '$/i'),
        $or: [
          { status: { $exists: false } },
          { status: 'SUCCESS' },
          { status: 'NOT USED' }, 
       ]
      };
    } else {
      query = {
        $or: [
          { status: { $exists: false } },
          { status: 'SUCCESS' },
          { status: 'NOT USED' }, 
       ]
      };
    }
    if (params.Name) {
      query.loginId = eval('/' + params.Name + '/i');
    }
    if (params.userType) {
      query.loginType = { $regex: params.userType, $options: 'i' };
    }
    if (params.bonusCode) {
      query.bonusCode = params.bonusCode;
    }
    if (params.transactionType) {
      query.transactionType = params.transactionType;
    }
    if (params.transferMode) {
      query.transferMode = params.transferMode;
    }
    if (params.referenceNumber) {
      query.referenceNumber = params.referenceNumber;
    }
    // if (params.sortValue) {
    //   query.sortValue = params.sortValue;
    // }
    if (params.startDate && params.endDate) {
      query.date = { $gte: params.startDate, $lte: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.date = { $lte: params.endDate };
    }
    console.log('list transaction history query', query);
    const transaction = await this.findTransactionHistory(query, {
      skip: params.skip || 0,
      limit: params.limit || 1000000,
      sortValue: params.sortValue,
    });

    console.log(
      'Successfully found the  listTransactionHistory',
      JSON.stringify(transaction),
    );
    return transaction;
  }

  async findTransactionHistory(
    query,
    paginate?: { skip: number; limit: number; sortValue: string },
  ) {
    console.log("inside findTransactionHistory", query, paginate);
    
    // remote.findTransactionHistory = function (query, cb) {
    //   console.log("inside findTransactionHistory ------ ", query);
    //   var skip = query.skip || 0;
    //   var limit = query.limit || 1000000;
    //   var sortValue = query.sortValue;
    //   delete query.sortValue;
    //   delete query.skip;
    //   delete query.limit;
    //   mongodb.adminDb.collection('transactionHistory')
    // .find(query).skip(skip).limit(limit).sort({ [sortValue]: -1 })
    // .toArray(function (err, result) {
    //     cb(err, result);
    //   });
    // };
    console.log("query==== ", query);
    const result = this.transactionHistoryModel.find(query);
    if (paginate) {
      if(paginate.sortValue){
        result
        .skip(paginate.skip)
        .limit(paginate.limit)
        .sort({ [paginate.sortValue]: -1 });
      } else {
        result
        .skip(paginate.skip)
        .limit(paginate.limit)
        .sort({ ['date']: -1 });
      }
      
    }
    return await result.exec();
  }

  async findTransactionWithDate (query) {
    const result = this.transactionHistoryModel.find(query);
    return await result.exec();
  }

  async assignTotalDebitTotalCredit(
    listTransaction,
    params: ListTransactionHistoryDto,
  ) {
    console.log('Inside assignTotalDebitAndTotalCredit params--> \n', params);
    console.log(
      'Inside assignTotalDebitTotalCredit listTransaction filters-->',
      listTransaction,
    );
    let query: any = {};
    const finalResult: any = {};
    finalResult.resultList = listTransaction;
    if (listTransaction.loginId) {
      query = {
        loginId: eval('/^' + listTransaction.loginId + '$/i'),
        $or: [
          { status: { $exists: false } },
          { status: 'SUCCESS' },
          { status: 'NOT USED' },
        ],
      };
    } else {
      query = {
        $or: [
          { status: { $exists: false } },
          { status: 'SUCCESS' },
          { status: 'NOT USED' },
        ],
      };
    }

    if (params.Name) {
      query.loginId = eval('/' + params.Name + '/i');
    }

    if (params.bonusCode) {
      query.bonusCode = params.bonusCode;
    }

    if (params.userType) {
      query.loginType = { $regex: params.userType, $options: 'i' };
    }

    if (params.transactionType) {
      query.transactionType = params.transactionType;
    }

    if (params.transferMode) {
      query.transferMode = params.transferMode;
    }

    if (params.referenceNumber) {
      query.referenceNumber = params.referenceNumber;
    }

    if (params.startDate && params.endDate) {
      query.date = {
        $gte: params.startDate,
        $lte: params.endDate,
      };
    }

    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.date = { $lte: params.endDate };
    }
    console.log('inside assignTotalDebitTotalCredit function query -->', query);

    finalResult.financeStatus = await this.assignQueryTotalDebitAndTotalCredit(
      query,
    );
    return finalResult;
  }

  async assignQueryTotalDebitAndTotalCredit(query) {
    // console.log("Inside assignTotalDebitTotalCredit db query -->", query);
    // mongodb.adminDb.collection('transactionHistory')
    //.aggregate([{ $match: query },
    //{ $group: { _id: "$transactionType",
    //totalAmount: { $sum: '$amount' } } }]).toArray(function (err, result) {
    //   console.log("Inside assignTotalDebitTotalCredit err,result-->\n", err, result);
    //   cb(err, result);
    // });
    return await this.transactionHistoryModel.aggregate([
      { $match: query },
      { $group: { _id: '$transactionType', totalAmount: { $sum: '$amount' } } },
    ]);
  }

  async listDepositInvoice (params) {
    console.log('inside listDepositInvoice', params);

    let query: any = {};

    if (!!params.userName) {
      query.userName = params.userName;
    }

    const result = await this.depositModel.find(query).skip(params.skip).limit(params.skip).sort({ ['createdAt']: -1 }).exec();

    return result;
  }

  async countDepositInvoice (params) {
    console.log('inside countDepositInvoice', params);
    
    let query: any = {};

    if (!!params.userName) {
      query.userName = params.userName;
    }

    const result = await this.depositModel.count(query);
    return result;
  }
}
