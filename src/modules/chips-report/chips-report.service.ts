import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionHistoryReportService } from '../transaction-history/service/transaction-history-report.service';
import { DailyChipsChart } from './dto/daily-chips-chart';
import { DailyChipsReport, TransferModeEnum } from './dto/daily-chips-report';
import { ListMonthlyBonusChipsReport } from './dto/list-monthly-bonus-chips-report';
import { MonthlyChipsReport } from './dto/monthly-chips-report';

@Injectable()
export class ChipsReportService {
  constructor(
    @Inject(TransactionHistoryReportService)
    protected readonly transactionHistoryReportService: TransactionHistoryReportService,
  ) {}

  async dailyChipsReport(params: DailyChipsReport) {
    console.log(
      'Inside listTransactionHistory ********',
      JSON.stringify(params),
    );
    let query: any = {};
    if (params.Name) {
      query.Name = eval('/' + params.Name + '/i');
    }
    if (params.loginId) {
      query.loginId = eval('/' + params.loginId + '/i');
    }
    if (params.names) {
      query.names = eval('/' + params.names + '/i');
    }
    if (params.startDate && params.endDate) {
      query.date = { $gte: params.startDate, $lt: params.endDate }
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate }
    }
    if (!params.startDate && params.endDate) {
      query.date = { $lt: params.endDate }
    }
    if (params.referenceNumber) {
      query.referenceNumber = params.referenceNumber
    }
    // if (params.minChips) {
    //   query.amount = params.minChips
    // }
    // if (params.maxChips) {
    //   query.amount = params.maxChips
    // }
    if (params.minChips && params.maxChips) {
      query.amount = {
        $gte: params.minChips,
        $lte: params.maxChips
      };
    } else if (params.minChips) {
      query.amount = { $gte: params.minChips };
    } else if (params.maxChips) {
      query.amount = { $lte: params.maxChips };
    }
    if (params.transferMode) {
      query.transferMode = params.transferMode
    }
    if (params.userName) {
      // query.userName = params.userName
      query.$or = [
        { userName: params.userName },
        { names: params.userName }
      ];
    }
    const skip = params.skip ? params.skip : 0;
    const limit = params.limit ? params.limit : 10;
    const sortValue = params.sortValue ? params.sortValue : 'date';
    delete params.skip;
    delete params.limit;
    delete params.sortValue;
    return await this.transactionHistoryReportService.findTransactionHistory(
      query,
      {
        skip,
        limit,
        sortValue,
      },
    );
  }

  async monthlyChipsReport(params: MonthlyChipsReport) {
    console.log('Inside monthlyChipsReportProcess == ', params);
    let query: any = {}
    if (params.startDate && params.endDate) {
      query.date = { $gte: params.startDate, $lt: params.endDate }
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate }
    }
    if (!params.startDate && params.endDate) {
      query.date = { $lt: params.endDate }
    }
    // if (params.date) {
    //   query.date = params.date
    // }
    console.log("query: ", query);
    const transactionHistory =
      await this.transactionHistoryReportService.findTransactionHistory(
        query,
        {
          skip: 0,
          limit: 1000000,
          sortValue: 'date',
        },
      );
    console.log("transactionHistory: ", transactionHistory);

    return this.filterDataByTransferMode(params, transactionHistory);
  }

  async filterDataByTransferMode(params: MonthlyChipsReport, transactionHistory) {
    // var monthlyTransferResult = [];
    // var ind = 0;
    // for (var j = params.date['$gte']; j <= params.date['$lt']; j = (new Date(j).setMonth(new Date(j).getMonth() + 1))) {
    //   var amount1 = 0, amount2 = 0, amount3 = 0;
    //   console.log("???????????", Number(new Date(j)));
    //   for (var i = 0; i < params.transactionResult.length; i++) {
    //     if (params.transactionResult[i].date >= j && params.transactionResult[i].date < (new Date(j).setMonth(new Date(j).getMonth() + 1))) {
    //       if (params.transactionResult[i].transferMode == 'Scratch Card') {
    //         amount1 = amount1 + parseInt(params.transactionResult[i].amount);
    //       }

    //       if (params.transactionResult[i].transferMode == 'FUND TRANSFER' && params.transactionResult[i].status === 'SUCCESS') {
    //         amount2 = amount2 + parseInt(params.transactionResult[i].amount);
    //       }

    //       if (params.transactionResult[i].transferMode == 'ONLINE TRANSFER' && params.transactionResult[i].status === 'SUCCESS') {
    //         amount3 = amount3 + parseInt(params.transactionResult[i].amount);
    //       }
    //     }
    //   }

    //   console.log("!!!!!!!!!!!!! ", j);

    //   if (amount1 > 0) {
    //     monthlyTransferResult[ind++] = { date: Number(new Date(j)), transferMode: 'SCRATCH CARD', amount: amount1 };
    //   }
    //   if (amount2 > 0) {
    //     monthlyTransferResult[ind++] = { date: Number(new Date(j)), transferMode: 'FUND TRANSFER', amount: amount2 };
    //   }
    //   if (amount3 > 0) {
    //     monthlyTransferResult[ind++] = { date: Number(new Date(j)), transferMode: 'ONLINE TRANSFER', amount: amount3 };
    //   }
    // }

    // cb(null, monthlyTransferResult);

    const monthlyTransferResult = [];
    let ind = 0;
    for (
      let j = params.date['$gte'];
      j <= params.date['$lt'];
      j = new Date(j).setMonth(new Date(j).getMonth() + 1)
    ) {
      
      let amount1 = 0;
      let amount2 = 0;
      let amount3 = 0;
      for (let i = 0; i < transactionHistory.length; i++) {
        if (
          transactionHistory[i].date >= j &&
          transactionHistory[i].date <
            new Date(j).setMonth(new Date(j).getMonth() + 1)
        ) {
          if (transactionHistory[i].transferMode == 'Scratch Card') {
            amount1 = amount1 + parseInt(transactionHistory[i].amount);
          }

          if (
            transactionHistory[i].transferMode == 'FUND TRANSFER' &&
            transactionHistory[i].status === 'SUCCESS'
          ) {
            amount2 = amount2 + parseInt(transactionHistory[i].amount);
          }

          if (
            transactionHistory[i].transferMode == 'ONLINE TRANSFER' &&
            transactionHistory[i].status === 'SUCCESS'
          ) {
            amount3 = amount3 + parseInt(transactionHistory[i].amount);
          }
        }
      }

      if (amount1 > 0) {
        monthlyTransferResult[ind++] = {
          date: Number(new Date(j)),
          transferMode: TransferModeEnum.scratchCard,
          amount: amount1,
        };
      }
      if (amount2 > 0) {
        monthlyTransferResult[ind++] = {
          date: Number(new Date(j)),
          transferMode: TransferModeEnum.funTransfer,
          amount: amount2,
        };
      }
      if (amount3 > 0) {
        monthlyTransferResult[ind++] = {
          date: Number(new Date(j)),
          transferMode: TransferModeEnum.onlineTransfer,
          amount: amount3,
        };
      }
    }
    return monthlyTransferResult;
  }

  async dailyChipsChart(params: DailyChipsChart) {
    console.log('Inside dailyChipsChartProcess == ', params);
    params.transactionResult = await this.findChipsDataCurrentMonth(params);
    console.log('params.transactionResult == ', params.transactionResult);
    params.currentMonthChipsData = await this.filterCurrentMonthDataToDailyData(
      params,
    );
    console.log(
      'params.currentMonthChipsData == ',
      params.currentMonthChipsData,
    );
    params.transactionResult = await this.findChipsDataPreviousMonth(params);
    console.log('params.transactionResult2 == ', params.transactionResult);
    this.filterPreviousMonthDataToDailyData(params);
    console.log('params == ', params);
    if (
      params.currentMonthChipsData.length > 0 ||
      params.previousMonthChipsData.length > 0
    ) {
      return params;
    } else {
      throw new NotFoundException('No data found');
    }
  }

  async findChipsDataCurrentMonth(params: DailyChipsChart) {
    // var startDate = params.addeddate;
    // var endDate = (new Date(params.addeddate).setMonth(new Date(params.addeddate).getMonth() + 1));
    // params.startDate = startDate;
    // params.endDate = endDate;
    // var query = {};
    // query.date = { '$gte': Number(startDate), '$lt': Number(endDate) };

    // findAllTransactionHistory(query, function (err, result) {
    //   if (!err && result) {
    //     params.transactionResult = result.transactionResult;
    //     cb(null, params);
    //   } else {
    //     cb({ success: false, info: 'unable to find chips data for current month!' });
    //   }
    // });
    const startDate = params.addeddate;
    const endDate = new Date(params.addeddate).setMonth(
      new Date(params.addeddate).getMonth() + 1,
    );
    params.startDate = startDate;
    params.endDate = endDate;
    console.log('params', params);

    const query: any = {};
    query.date = { $gte: Number(startDate), $lt: Number(endDate) };
    return await this.transactionHistoryReportService.findTransactionHistory(
      query,
      {
        skip: 0,
        limit: 1000000,
        sortValue: 'date',
      },
    );
  }

  filterCurrentMonthDataToDailyData(params: DailyChipsChart) {
    // var dailyChipsData = [];
    // var i = 0;
    // for (var tempCheck = params.startDate; tempCheck < params.endDate; tempCheck += (24 * 60 * 60 * 1000)) {
    //   var dailyChips = 0;
    //   for (var tempObj in params.transactionResult) {
    //     if (params.transactionResult[tempObj].date >= tempCheck && params.transactionResult[tempObj].date < (tempCheck + (24 * 60 * 60 * 1000))) {
    //       dailyChips = dailyChips + parseInt(params.transactionResult[tempObj].amount);
    //     }
    //   }
    //   if (dailyChips > 0) {
    //     dailyChipsData[i++] = { date: tempCheck, dailyChips: parseInt(dailyChips) };
    //   }
    // }
    // dailyChipsData.sort(function (a, b) {
    //   return parseFloat(b.date) - parseFloat(a.date);
    // });

    // console.log('result ==== ', dailyChipsData);
    // cb(null, dailyChipsData);
    const dailyChipsData = [];
    let i = 0;
    for (
      let tempCheck = params.startDate;
      tempCheck < params.endDate;
      tempCheck += 24 * 60 * 60 * 1000
    ) {
      let dailyChips = 0;
      for (const tempObj in params.transactionResult) {
        if (
          params.transactionResult[tempObj].date >= tempCheck &&
          params.transactionResult[tempObj].date <
            tempCheck + 24 * 60 * 60 * 1000
        ) {
          dailyChips =
            dailyChips + parseInt(params.transactionResult[tempObj].amount);
        }
      }
      if (dailyChips > 0) {
        dailyChipsData[i++] = {
          date: tempCheck,
          dailyChips: dailyChips,
        };
      }
    }
    dailyChipsData.sort(function (a, b) {
      return parseFloat(b.date) - parseFloat(a.date);
    });

    return dailyChipsData;
  }

  async findChipsDataPreviousMonth(params: DailyChipsChart) {
    // var endDate = params.addeddate;
    // var startDate = (new Date(params.addeddate).setMonth(new Date(params.addeddate).getMonth() - 1));
    // params.startDate = startDate;
    // params.endDate = endDate;
    // var query = {};
    // query.date = { '$gte': Number(startDate), '$lt': Number(endDate) };

    // findAllTransactionHistory(query, function (err, result) {
    //   if (!err && result) {
    //     params.transactionResult = result.transactionResult;
    //     cb(null, params);
    //   } else {
    //     cb({ success: false, info: 'unable to find chips data for current month!' });
    //   }
    // });
    const endDate = params.addeddate;
    const startDate = new Date(params.addeddate).setMonth(
      new Date(params.addeddate).getMonth() - 1,
    );
    params.startDate = startDate;
    params.endDate = endDate;
    const query: any = {};
    query.date = { $gte: Number(startDate), $lt: Number(endDate) };
    return await this.transactionHistoryReportService.findTransactionHistory(
      query,
      { skip: 0, limit: 1000000, sortValue: 'date' },
    );
  }

  filterPreviousMonthDataToDailyData(params: DailyChipsChart) {
    params.previousMonthChipsData = this.filterDataToDailyData(params);
    delete params.transactionResult;
  }

  filterDataToDailyData(params: DailyChipsChart) {
    // var dailyChipsData = [];
    // var i = 0;
    // for (var tempCheck = params.startDate; tempCheck < params.endDate; tempCheck += (24 * 60 * 60 * 1000)) {
    //   var dailyChips = 0;
    //   for (var tempObj in params.transactionResult) {
    //     if (params.transactionResult[tempObj].date >= tempCheck && params.transactionResult[tempObj].date < (tempCheck + (24 * 60 * 60 * 1000))) {
    //       dailyChips = dailyChips + parseInt(params.transactionResult[tempObj].amount);
    //     }
    //   }
    //   if (dailyChips > 0) {
    //     dailyChipsData[i++] = { date: tempCheck, dailyChips: parseInt(dailyChips) };
    //   }
    // }
    // dailyChipsData.sort(function (a, b) {
    //   return parseFloat(b.date) - parseFloat(a.date);
    // });

    // console.log('result ==== ', dailyChipsData);
    // cb(null, dailyChipsData);

    const dailyChipsData = [];
    let i = 0;
    for (
      let tempCheck = params.startDate;
      tempCheck < params.endDate;
      tempCheck += 24 * 60 * 60 * 1000
    ) {
      let dailyChips = 0;
      for (const tempObj in params.transactionResult) {
        if (
          params.transactionResult[tempObj].date >= tempCheck &&
          params.transactionResult[tempObj].date <
            tempCheck + 24 * 60 * 60 * 1000
        ) {
          dailyChips =
            dailyChips + parseInt(params.transactionResult[tempObj].amount);
        }
      }
      if (dailyChips > 0) {
        dailyChipsData[i++] = {
          date: tempCheck,
          dailyChips: dailyChips,
        };
      }
    }

    dailyChipsData.sort(function (a, b) {
      return parseFloat(b.date) - parseFloat(a.date);
    });
    return dailyChipsData;
  }

  async listMonthlyBonusChipsReport(params: ListMonthlyBonusChipsReport) {
    console.log(
      'Inside findAllTransactionHistory ********',
      JSON.stringify(params),
    );
    // var query = {};
    // var newResult = {};
    // newResult.totalDepositAmount = 0;
    // newResult.totalLockedBonus  = 0;
    // newResult.totalInstantBonus = 0 ;
    // var startDate = params.addeddate;
    // var endDate = (new Date(params.addeddate).setMonth(new Date(params.addeddate).getMonth() + 1));
    // query.date = { '$gte': Number(startDate), '$lte': Number(endDate)};
    // admindb.listMonthlyBonusChipsReport(query, function (err, result) {
    //   if (err) {
    //     console.log('In error !!!!!!!!');
    //     return res.json({success: false, info: "Unable to Find Data"});
    //   } else if(!err && result) {
    //     console.log("++++++++++++++++")
    //     for(var i = 0 ; i< result.length ; i++){
    //       newResult.totalDepositAmount =  newResult.totalDepositAmount + result[i].amount;
    //       if(result[i].lockedBonusAmount >= 0){
    //       newResult.totalLockedBonus =  newResult.totalLockedBonus + Number(result[i].lockedBonusAmount);
    //     } if(result[i].bonusAmount >= 0){
    //       newResult.totalInstantBonus = newResult.totalInstantBonus + Number(result[i].bonusAmount);
    //     }
    //     }
    //     return res.json({success: true, result: newResult });
    //   } else{
    //     return res.json({success: false, info: "Internal error from database"});
    //   }
    // });
    const query: any = {};
    const newResult: any = {};
    newResult.totalDepositAmount = 0;
    newResult.totalLockedBonus = 0;
    newResult.totalInstantBonus = 0;
    const startDate = params.addeddate;
    const endDate = new Date(params.addeddate).setMonth(
      new Date(params.addeddate).getMonth() + 1,
    );
    query.date = { $gte: Number(startDate), $lte: Number(endDate) };
    const result =
      await this.transactionHistoryReportService.findTransactionHistory(query);
    if (!result) {
      throw new NotFoundException('Unable to Find Data');
    }

    for (let i = 0; i < result.length; i++) {
      newResult.totalDepositAmount =
        newResult.totalDepositAmount + result[i].amount;
      if (result[i].lockedBonusAmount >= 0) {
        newResult.totalLockedBonus =
          newResult.totalLockedBonus + Number(result[i].lockedBonusAmount);
      }
      if (result[i].bonusAmount >= 0) {
        newResult.totalInstantBonus =
          newResult.totalInstantBonus + Number(result[i].bonusAmount);
      }
    }
    return newResult;
  }

  countDataInTransactionHistory(params) {
    console.log(
      'Inside countDataInTransactionHistory ********',
      JSON.stringify(params),
    );
    delete params.skip;
    delete params.limit;
    let query: any = {};
    if (params.Name) {
      query.Name = eval('/' + params.Name + '/i');
    }
    if (params.loginId) {
      query.loginId = eval('/' + params.loginId + '/i');
    }
    if (params.names) {
      query.names = eval('/' + params.names + '/i');
    }
    if (params.startDate && params.endDate) {
      query.date = { $gte: params.startDate, $lt: params.endDate }
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate }
    }
    if (!params.startDate && params.endDate) {
      query.date = { $lt: params.endDate }
    }
    if (params.referenceNumber) {
      query.referenceNumber = params.referenceNumber
    }
    // if (params.minChips) {
    //   query.amount = params.minChips
    // }
    // if (params.maxChips) {
    //   query.amount = params.maxChips
    // }
    if (params.minChips && params.maxChips) {
      query.amount = {
        $gte: params.minChips,
        $lte: params.maxChips
      };
    } else if (params.minChips) {
      query.amount = { $gte: params.minChips };
    } else if (params.maxChips) {
      query.amount = { $lte: params.maxChips };
    }
    if (params.transferMode) {
      query.transferMode = params.transferMode
    }
    if (params.userName) {
      // query.userName = params.userName
      query.$or = [
        { userName: params.userName },
        { names: params.userName }
      ];
    }
    return this.transactionHistoryReportService.getTransactonHistoryCount(
      query,
    );

    // admindb.getTransactionHistoryCount(query, function (err, result) {
    //   if (err) {
    //     console.log('In error !!!!!!!!');
    //     return res.json({success: false, result: err});
    //   } else {
    //     console.log('Successfully found  countDataInTransactionHistory', JSON.stringify(result));
    //     return res.json({success: true, result: result});
    //   }
    // });
  }
}
