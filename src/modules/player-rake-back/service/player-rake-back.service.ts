import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { FinanceDbModel } from '@/database/connections/constants';
import { InjectFinanceModel } from '@/database/connections/finance-db';
import { FinanceModule } from '@/modules/finance/finance.module';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserService } from '../../user/user.service';
import { CountDataForRakeBackDto } from '../dto/count-data-for-rake-back.dto';
import { CountRakebackData } from '../dto/count-rake-back-data.dto';
import { ListRakebackData } from '../dto/list-rake-back-data.dto';
import { PlayerRakeBackDto } from '../dto/player-rake-back.dto';

@Injectable()
export class PlayerRakeBackService {
  constructor(
    @InjectFinanceModel(FinanceDbModel.PlayerRakeBack)
    protected readonly rakeBackModel: Model<any>,
    @InjectFinanceModel(FinanceDbModel.Fundrake)
    protected readonly fundrakeModel: Model<any>,
    @InjectAdminModel(AdminDBModel.Affiliates)
    protected readonly affiliates: Model<any>,
    @InjectAdminModel(AdminDBModel.RakeReport)
    protected readonly rakeReport: Model<any>,
    @InjectAdminModel(AdminDBModel.RakebackPlayerHistory)
    protected readonly rakebackPlayerHistory: Model<any>,
    @InjectAdminModel(AdminDBModel.RakebackHistory)
    protected readonly rakebackHistory: Model<any>,
    @Inject(UserService)
    protected readonly userService: UserService,
  ) {}

  async playerRakeBackReport(params: PlayerRakeBackDto) {
    console.log("inside playerRakeBackReport", params);
    
    //   async.waterfall(
    //     [
    //         async.apply(checkPlayerWithUsername, req.body),
    //         findRakeDetailsFromPlayer,
    //     ],
    //     function (err, result) {
    //         if (!err && result) {
    //             return res.json({ success: true, result: result });
    //         } else {
    //             return res.json({ success: false, info: err.info });
    //         }
    //     }
    // );
    // await this.checkPlayerWithUsername(params);
    // return await this.findRakeDetailsFromPlayer(params);
    return await this.rakePlayerReport(params);
  }

  async rakePlayerReport (params: any) {
    console.log("inside rakePlayerReport", params);
    var query: any = {};

    if (params.startDate && params.endDate) {
      const dateStart = new Date(params.startDate)
      const dateEnd = new Date(params.endDate)

      query.startDate = dateStart;
      query.endDate = dateEnd;
    }
    if(params.rakeByUsername){
      query.rakeByUsername = params.rakeByUsername
    }
    query.skip = params.skip;
    query.limit = params.limit;

    const count = await this.getRakePlayerReports(query);
    console.log("count: ", count);
    const generatedFrom1stLine = await this.getGeneratedFrom1stLineRakebackPlayer(query.startDate, query.endDate, query.rakeByUsername);
    console.log("generatedFrom1stLine: ", generatedFrom1stLine);
    const collectedFrom1stLine = await this.getCollectedFrom1stLineRakebackPlayer(query.startDate, query.endDate, query.rakeByUsername);
    console.log("collectedFrom1stLine: ", collectedFrom1stLine);
    const generatedFrom2ndLine = await this.getGeneratedFrom2ndLineRakebackPlayer(query.startDate, query.endDate, query.rakeByUsername);
    console.log("generatedFrom2ndLine: ", generatedFrom2ndLine);
    const collectedFrom2ndLine = await this.getCollectedFrom2ndLineRakebackPlayer(query.startDate, query.endDate, query.rakeByUsername);
    console.log("collectedFrom2ndLine: ", collectedFrom2ndLine);
    const playerGeneratedRake = await this.getPlayerGeneratedRake(new Date(query.startDate), new Date(), query.rakeByUsername);
    console.log("playerGeneratedRake: ", playerGeneratedRake);
    const totalRakebackCollected = await this.getTotalRakebackCollected(query);
    console.log("totalRakebackCollected: ", totalRakebackCollected);
    return {
      count,
      generatedFrom1stLine,
      collectedFrom1stLine,
      generatedFrom2ndLine,
      collectedFrom2ndLine,
      playerGeneratedRake,
      totalRakebackCollected
    }
  }

  async getTotalRakebackCollected (query) {
    let dataQuery: any = {}
    if (query.rakeByUsername) {
      dataQuery.userName = query.rakeByUsername
    }
    return this.rakebackPlayerHistory.find(dataQuery)
  }

  async getPlayerGeneratedRake (from, to, userName) {
    return this.rakeReport.aggregate([
      {
        $match: {
          Timestamp:
          {
            $gt: from,
            $lte: to
          },
          username: userName
        }
      },
      {
        $group: {
          _id: "",
          totalRake: {
            $sum: "$RakeGenerated"
          }
        }
      }
    ])
  }

  async getCollectedFrom2ndLineRakebackPlayer (from, to, userName) {
    const query: any = {};
    if (from && to) query.Timestamp = { $gt: from, $lte: to };
    query.RakeTo2ndLineName = userName;
    query.secondStatus = "approved";
    return this.rakeReport.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "",
          generatedRakeBack: {
            $sum: "$RakeTo2ndLine"
          }
        }
      }
    ])
  }

  async getGeneratedFrom2ndLineRakebackPlayer (from, to, userName) {
    const query: any = {};
    if (from && to) query.Timestamp = { $gt: from, $lte: to };
    query.RakeTo2ndLineName = userName;
    return this.rakeReport.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "",
          generatedRakeBack: {
            $sum: "$RakeTo2ndLine"
          }
        }
      }
    ])
  }

  async getCollectedFrom1stLineRakebackPlayer (from, to, userName) {
    const query: any = {};
    if (from && to) query.Timestamp = { $gt: from, $lte: to };
    query.RakeTo1StLineName = userName;
    query.firstStatus = "approved"
    return this.rakeReport.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "",
          generatedRakeBack: {
            $sum: "$RakeTo1StLine"
          }
        }
      }
    ])
  }

  async getGeneratedFrom1stLineRakebackPlayer (from, to, userName) {
    const query: any = {};

    if (from && to) query.Timestamp = { $gt: from, $lte: to };
    query.RakeTo1StLineName = userName;
    console.log("getGeneratedFrom1stLineRakebackPlayer")
    console.log(query);
    return this.rakeReport.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "",
          generatedRakeBack: {
            $sum: "$RakeTo1StLine"
          }
        }
      }
    ])
  }

  async getRakePlayerReports (query: any) {
    console.log("querygetRakePlayerReport", query);
    const pipeline = []
	
    if (!!query.rakeByUsername) {
      pipeline.push({
        $or: [
          { RakeTo1StLineName: query.rakeByUsername },
          { RakeTo2ndLineName: query.rakeByUsername }
        ]
      })
    }

    if (!!query.startDate && !!query.endDate) {
      const startDate = new Date(query.startDate)
      const endDate = new Date(query.endDate)
      const isoStartDate = startDate.toISOString()
      const isoEndDate = endDate.toISOString()
      
      pipeline.push({
        Timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      })
    }

    return this.rakeReport.aggregate([
      {
        $match: {
          $and: pipeline,
        },
      },
      { $sort: { Timestamp: -1 } },
			{ $skip: query.skip },
			{ $limit: query.limit },
    ])
  }

  async checkPlayerWithUsername(params: PlayerRakeBackDto) {
    // if (!params.rakeByUsername) {
    //     cb(null, params);
    // } else {
    //     db.findUser(
    //         { userName: eval('/' + params.rakeByUsername + '/i') },
    //         function (err, result) {
    //             console.log('errr-----------result', err, result);
    //             if (!err && result) {
    //                 cb(null, params);
    //             } else {
    //                 cb({ success: false, info: 'Player not found!' });
    //             }
    //         }
    //     );
    // }
    if (!params.rakeByUsername) {
      return;
    }

    // const userName = eval(`/${params.rakeByUsername}/`);
    const userName = params.rakeByUsername;
    const player = await this.userService.findOne({
      userName,
    });
    if (!player) {
      throw new NotFoundException('Player not found!');
    }
  }

  async findRakeDetailsFromPlayer(params: PlayerRakeBackDto): Promise<{
    result: any;
    totalRake: number;
  }> {
    console.log("inside findRakeDetailsFromPlayer", params);
    
    // var query = {};
    // query.addeddate = { $gte: params.startDate, $lte: params.endDate };
    // if (params.rakeByUsername) {
    //     query.rakeByUsername = params.rakeByUsername;
    // }
    // query.playerRakeBackPercent = { $gte: 0 };
    // query.skip = params.skip;
    // query.limit = params.limit;
    // financeDB.getRakeData(query, function (err, result) {
    //     if (!err && result) {
    //         if (result.length > 0) {
    //             financeDB.findTotalRakeGenerated(
    //                 query,
    //                 '',
    //                 '$playerRakeBack',
    //                 function (err, result1) {
    //                     console.log(
    //                         '----------------------------line 2506',
    //                         err,
    //                         result1
    //                     );
    //                     cb(null, {
    //                         result: result,
    //                         totalRake: result1[0].amount.toFixed(2),
    //                     });
    //                 }
    //             );
    //         } else {
    //             cb({ success: false, info: 'No data found' });
    //         }
    //     } else {
    //         cb({ success: false, info: 'No data found' });
    //     }
    // });
    const query: any = {};
    query.addeddate = { $gte: params.startDate, $lte: params.endDate };
    if (params.rakeByUsername) {
      query.rakeByUsername = params.rakeByUsername;
    }

    query.playerRakeBackPercent = { $gte: 0 };
    const rakeData = await this.getRakeData(query, {
      skip: params.skip,
      limit: params.limit,
    });
    console.log('rakeData', rakeData);
    if (!rakeData && rakeData.length === 0) {
      throw new NotFoundException('No Rake data found');
    }

    //   financeDB.findTotalRakeGenerated(
    //     query,
    //     '',
    //     '$playerRakeBack',
    //     function (err, result1) {
    //         console.log(
    //             '----------------------------line 2506',
    //             err,
    //             result1
    //         );
    //         cb(null, {
    //             result: result,
    //             totalRake: result1[0].amount.toFixed(2),
    //         });
    //     }
    // );
    const totalRakeGenerated = await this.findTotalRakeGenerated(
      query,
      '',
      '$playerRakeBack',
    );
    console.log('totalRakeGenerated', totalRakeGenerated);
    return {
      result: rakeData,
      // totalRake: totalRakeGenerated[0]?.amount?.toFixed(2),
      totalRake: totalRakeGenerated[0]?.amount,
    };
  }

  async findTotalRakeGenerated(query, groupBy, aggregateBy) {
    // mongodb.financeDB
    //     .collection('fundrake')
    //     .aggregate([
    //         { $match: query },
    //         { $group: { _id: groupBy, amount: { $sum: aggregateBy } } },
    //     ])
    //     .toArray(function (err, result) {
    //         cb(err, result);
    //     });
    console.log('query 2', query);
    const totalRakeGenerated = await this.fundrakeModel
      .aggregate([
        { $match: query },
        { $group: { _id: groupBy, amount: { $sum: aggregateBy } } },
      ])
      .exec();
    console.log('totalRakeGenerated', totalRakeGenerated);
    return totalRakeGenerated;
  }

  async getRakeData(query, paginate: { skip: number; limit: number }) {
    console.log('query1', query);
    //   remote.getRakeData = function (query, callback) {
    //     var skip = query.skip || 0;
    //     var limit = query.limit || 0;
    //     delete query.skip;
    //     delete query.limit;
    //     mongodb.financeDB
    //         .collection('fundrake')
    //         .find(query)
    //         .skip(skip)
    //         .limit(limit)
    //         .toArray(function (err, result) {
    //             callback(err, result);
    //         });
    // };
    const rakeData = await this.fundrakeModel
      .find(query)
      .skip(paginate.skip || 0)
      .limit(paginate.limit || 0)
      .exec();
    return rakeData;
  }

  async countDataForRakeBack(params: CountDataForRakeBackDto) {
    // console.log('----------------------------', req.body);
    // async.waterfall(
    //     [
    //         async.apply(checkPlayerWithUsername, req.body),
    //         countRakeDetailFromPlayer,
    //     ],
    //     function (err, result) {
    //         if (!err && result) {
    //             return res.json({ success: true, result: result });
    //         } else {
    //             return res.json({ success: false, info: err.info });
    //         }
    //     }
    // );
    const { startDate, endDate, rakeByUsername } = params;
    await this.checkPlayerWithUsername({
      startDate,
      endDate,
      rakeByUsername,
    });
    return await this.countRakeDetailFromPlayer(params);
  }

  async countRakeDetailFromPlayer(params: CountDataForRakeBackDto) {
    // console.log('======================', params);
    // var query = {};
    // query.addeddate = { $gte: params.startDate, $lte: params.endDate };
    // if (params.rakeByUsername) {
    //     query.rakeByUsername = params.rakeByUsername;
    // }
    // query.playerRakeBackPercent = { $gte: 0 };
    // financeDB.getRakeDataCount(query, function (err, count) {
    //     console.log('err count in countRakeDataForRakeReport ', err, count);
    //     if (!err && count) {
    //         cb(null, count);
    //     } else {
    //         cb({ success: false, info: 'No data found' });
    //     }
    // });
    const query: any = {};
    query.addeddate = { $gte: params.startDate, $lte: params.endDate };
    if (params.rakeByUsername) {
      query.rakeByUsername = params.rakeByUsername;
    }

    query.playerRakeBackPercent = { $gte: 0 };
    return await this.getRakeDataCount(query);
  }

  async getRakeDataCount(query) {
    // console.log('getRakeDataCount ', query);
    // mongodb.financeDB
    //     .collection('fundrake')
    //     .count(query, function (err, result) {
    //         callback(err, result);
    //     });
    const rakeDataCount = await this.fundrakeModel.count(query);
    return rakeDataCount;
  }

  async countRakebackData(params: CountRakebackData) {
    // console.log('inside countRakebackData ', req.body);
    // async.waterfall(
    //     [
    //         async.apply(checkIfPlayerFilter, req.body),
    //         countRakebackTransactionData,
    //     ],
    //     function (err, result) {
    //         console.log('err, result', err, result);
    //         if (!err && result) {
    //             res.json({ success: true, count: result });
    //         } else {
    //             res.json({ success: false, info: err.info });
    //         }
    //     }
    // );
    await this.checkIfPlayerFilter(params);
    return await this.countRakebackTransactionData(params);
  }

  async checkIfPlayerFilter(params: CountRakebackData) {
    // console.log('inside checkIfPlayerFilter ', params);
    // if (params.filterPlayer) {
    //     checkPlayerExists(params, function (err, result) {
    //         console.log('err, result', err, result);
    //         if (!err && result) {
    //             cb(null, params);
    //         } else {
    //             cb({ success: false, info: 'Player not found!' });
    //         }
    //     });
    // } else {
    //     cb(null, params);
    // }
    if (params.filterPlayer) {
      const isAffiliateRef = await this.checkPlayerExists(params);
      console.log(isAffiliateRef);
      if (!isAffiliateRef) {
        throw new BadRequestException(
          'Player not found for logged in affiliate!',
        );
      }
    } else {
      return params;
    }
  }

  async checkPlayerExists(params: CountRakebackData): Promise<boolean> {
    // console.log('inside checkPlayerExists ', params);
    // db.findUser(
    //     { userName: eval('/^' + params.filterPlayer + '$/i') },
    //     function (err, result) {
    //         if (!err && result) {
    //             params.filterPlayer = result.userName;
    //             if (params.parentUser) {
    //                 if (result.isParentUserName == params.parentUser) {
    //                     cb(null, params);
    //                 } else {
    //                     admindb.getUser(
    //                         { userName: result.isParentUserName },
    //                         function (err, result) {
    //                             if (!err) {
    //                                 if (
    //                                     result &&
    //                                     result.parentUser == params.parentUser
    //                                 ) {
    //                                     cb(null, params);
    //                                 } else {
    //                                     cb({
    //                                         success: false,
    //                                         info: 'Player not found for logged in affiliate!',
    //                                     });
    //                                 }
    //                             } else {
    //                                 cb({
    //                                     success: false,
    //                                     info: 'Unable to find player details!',
    //                                 });
    //                             }
    //                         }
    //                     );
    //                 }
    //             } else {
    //                 cb(null, params);
    //             }
    //         } else {
    //             cb({ success: false, info: 'Player not found!' });
    //         }
    //     }
    console.log('inside checkPlayerExists ', params);
    const userName = eval(`/^${params.filterPlayer}$/i`);
    const player = await this.userService.findOne({
      userName,
    });
    if (!player) {
      throw new NotFoundException('Player not found!');
    }
    params.filterPlayer = player.userName;
    if (params.parentUser) {
      if (player.isParentUserName === params.parentUser) {
        return true;
      } else {
        const affiliate = await this.affiliates.findOne({
          userName: player.isParentUserName,
        });

        if (!affiliate) {
          throw new NotFoundException('player not found');
        }

        if (affiliate.parentUser === params.parentUser) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }

  async countRakebackTransactionData(params: CountRakebackData) {
    // console.log('inside countRakebackTransactionData ', params);
    // var query = {};
    // if (params.filterPlayer) {
    //     query.rakeByUsername = params.filterPlayer;
    // }
    // if (params.filterReferenceNo) {
    //     query.referenceNumber = params.filterReferenceNo;
    // }
    // if (params.parentUser) {
    //     query.parentUser = eval('/^' + params.parentUser + '$/i');
    // }
    // if (params.startTime && params.endTime) {
    //     query.transferAt = { $gte: params.startTime, $lte: params.endTime };
    // }
    // if (params.startTime && !params.endTime) {
    //     query.transferAt = { $gte: params.startTime };
    // }
    // if (params.endTime && !params.startTime) {
    //     query.transferAt = { $lte: params.endTime };
    // }

    // query.transfer = true;
    // financeDB.getRakebackDataCount(query, function (err, result) {
    //     console.log('err, result', err, result);
    //     if (!err && result) {
    //         cb(null, result);
    //     } else {
    //         cb({ success: false, info: 'No data found' });
    //     }
    // });
    console.log('inside countRakebackTransactionData ', params);
    const query: any = {};
    if (params.filterPlayer) {
      query.rakeByUsername = params.filterPlayer;
    }
    if (params.filterReferenceNo) {
      query.referenceNumber = params.filterReferenceNo;
    }
    if (params.parentUser) {
      query.parentUser = eval('/^' + params.parentUser + '$/i');
    }
    if (params.startTime && params.endTime) {
      query.transferAt = { $gte: params.startTime, $lte: params.endTime };
    }
    if (params.startTime && !params.endTime) {
      query.transferAt = { $gte: params.startTime };
    }
    if (params.endTime && !params.startTime) {
      query.transferAt = { $lte: params.endTime };
    }
    query.transfer = true;
    return await this.getRakebackDataCount(query);
  }

  async getRakebackDataCount(query) {
    console.log('getRakebackDataCount ', query);
    // mongodb.financeDB
    //     .collection('playerRakeBack')
    //     .count(query, function (err, result) {
    //         callback(err, result);
    //     });
    const count = await this.rakeBackModel.count(query);
    return count;
  }

  async listRakebackData(params: ListRakebackData) {
    console.log('inside listRakebackData ', params);
    await this.checkIfPlayerFilter(params);
    return await this.getRakebackTransactionData(params);
  }

  async getRakebackTransactionData(params: ListRakebackData) {
    console.log('inside getRakebackTransactionData ', params);
    // var query = {};
    // if (params.filterPlayer) {
    //     query.rakeByUsername = params.filterPlayer;
    // }
    // if (params.filterReferenceNo) {
    //     query.referenceNumber = params.filterReferenceNo;
    // }
    // if (params.parentUser) {
    //     query.parentUser = eval('/^' + params.parentUser + '$/i');
    // }
    // if (params.startTime && params.endTime) {
    //     query.transferAt = { $gte: params.startTime, $lte: params.endTime };
    // }
    // if (params.startTime && !params.endTime) {
    //     query.transferAt = { $gte: params.startTime };
    // }
    // if (params.endTime && !params.startTime) {
    //     query.transferAt = { $lte: params.endTime };
    // }

    // query.transfer = true;
    // query.skip = params.skip;
    // query.limit = params.limit;
    // console.log('line 2366 ', query);
    // financeDB.getRakebackData(query, function (err, result) {
    //     console.log('err, result', err, result.length);
    //     if (!err && result) {
    //         cb(null, result);
    //     } else {
    //         cb({ success: false, info: 'No data found' });
    //     }
    // });

    const query: any = {};
    if (params.filterPlayer) {
      query.rakeByUsername = params.filterPlayer;
    }
    if (params.filterReferenceNo) {
      query.referenceNumber = params.filterReferenceNo;
    }
    if (params.parentUser) {
      query.parentUser = eval('/^' + params.parentUser + '$/i');
    }
    if (params.startTime && params.endTime) {
      query.transferAt = { $gte: params.startTime, $lte: params.endTime };
    }
    if (params.startTime && !params.endTime) {
      query.transferAt = { $gte: params.startTime };
    }
    if (params.endTime && !params.startTime) {
      query.transferAt = { $lte: params.endTime };
    }

    query.transfer = true;
    console.log('query', query);
    return await this.getRakebackData(query, {
      skip: params.skip,
      limit: params.limit,
    });
  }

  async getRakebackData(query, paginate: { skip: number; limit: number }) {
    // var skip = query.skip || 0;
    // var limit = query.limit || 0;
    // delete query.skip;
    // delete query.limit;
    // mongodb.financeDB
    //     .collection('playerRakeBack')
    //     .find(query)
    //     .skip(skip)
    //     .limit(limit)
    //     .sort({ transferAt: -1 })
    //     .toArray(function (err, result) {
    //         callback(err, result);
    //     });
    return await this.rakeBackModel
      .find(query)
      .skip(paginate.skip)
      .limit(paginate.limit)
      .sort({ transferAt: -1 })
      .exec();
  }

  getTotalRakebackReleased(query) {
    return this.rakeBackModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: '_id',
          totalRakeBackReleased: { $sum: '$playerRakeBack' },
        },
      },
    ]);
  }

  async listRakeDataForRakeReportSearch (params) {
    console.log("inside listRakeDataForRakeReportSearch", params);

    var query: any = {};

    if (params.startTime && !params.endTime) {
      query.startDate = params.startTime;
    }
    if (!params.startTime && params.endTime) {
      query.endDate = params.endTime;
    }
    if (params.startTime && params.endTime) {
      query.Timestamp = {
        $gte: new Date(params.startTime),
        $lte: new Date(params.endTime)
      }
    }
    if (params.rakeByUsername) {
      query.username = params.rakeByUsername;
    }
    if (params.rakeByTableName) {
      query.TableName = params.rakeByTableName;
    }
    if (params.rakeByHandId) {
      query.HandId = params.rakeByHandId;
    }
    // query.skip = params.skip
    // query.limit = params.limit
    // query.sortValue = params.sortValue

    let data: any;
    let sortBy: any;

    if (params.sortValue) {
      if (params.sortValue === 'addeddate') {
        sortBy = { Timestamp: -1 }
      } else {
        sortBy = { RakeGenerated: -1 }
      }
      data = await this.rakeReport.find(query).skip(params.skip).limit(params.limit).sort(sortBy).exec()
    } else {
      data = await this.rakeReport.find(query).skip(params.skip).limit(params.limit).sort({ Timestamp: -1 }).exec()
    }
    
    return data
  }

  async totalRakeDataForRakeReportSearch (params) {
    console.log("inside totalRakeDataForRakeReportSearch", params);

    var query: any = {};

    if (params.startTime && !params.endTime) {
      query.startDate = params.startTime;
    }
    if (!params.startTime && params.endTime) {
      query.endDate = params.endTime;
    }
    if (params.startTime && params.endTime) {
      query.Timestamp = {
        $gte: new Date(params.startTime),
        $lte: new Date(params.endTime)
      }
    }
    if (params.rakeByUsername) {
      query.username = params.rakeByUsername;
    }
    if (params.rakeByTableName) {
      query.TableName = params.rakeByTableName;
    }
    if (params.rakeByHandId) {
      query.HandId = params.rakeByHandId;
    }
    // query.skip = params.skip
    // query.limit = params.limit
    // query.sortValue = params.sortValue

    let data: any;
    let sortBy: any;

    if (params.sortValue) {
      if (params.sortValue === 'addeddate') {
        sortBy = { Timestamp: -1 }
      } else {
        sortBy = { RakeGenerated: -1 }
      }
      data = await this.rakeReport.find(query).exec()
    } else {
      data = await this.rakeReport.find(query).exec()
    }
    
    return data
  }

  async countRakeDataReportDataSearch (params) {
    console.log("inside countRakeDataReportDataSearch", params);
    
    var query: any = {};
    var queryTotal: any = {};

    if (params.startTime && !params.endTime) {
      query.startDate = params.startTime;
      queryTotal.startDate = params.startTime;
    }
    if (!params.startTime && params.endTime) {
      query.endDate = params.endTime;
      queryTotal.endDate = params.endTime;
    }
    if (params.startTime && params.endTime) {
      query.Timestamp = {
        $gte: new Date(params.startTime),
        $lte: new Date(params.endTime)
      }
    }
    if (params.rakeByUsername) {
      query.username = params.rakeByUsername;
    }
    if (params.rakeByTableName) {
      query.TableName = params.rakeByTableName;
    }
    if (params.rakeByHandId) {
      query.HandId = params.rakeByHandId;
    }

    const countData = await this.rakeReport.count(query);
    return countData;
  }

  async listRakeDataRakeHistory (params) {
    console.log('inside listRakeDataRakeHistory', params);
    
    var query: any = {};

    if (params.startTime && !params.endTime) {
      query.startDate = params.startTime;
    }
    if (!params.startTime && params.endTime) {
      query.endDate = params.endTime;
    }
    if (params.startTime && params.endTime) {
      query.createdAt = {
        $gte: new Date(params.startTime),
        $lte: new Date(params.endTime)
      }
    }
    if (params.rakeByUsername) {
      query.userName = params.rakeByUsername;
    }
    
    const data = await this.rakebackPlayerHistory.find(query).skip(params.skip).limit(params.limit).sort({ createdAt: -1 }).exec()

    return data;
  }

  async countRakeDataRakeHistory (params) {
    console.log('inside countRakeDataRakeHistory', params);
    
    var query: any = {};

    if (params.startTime && !params.endTime) {
      query.startDate = params.startTime;
    }
    if (!params.startTime && params.endTime) {
      query.endDate = params.endTime;
    }
    if (params.startTime && params.endTime) {
      query.createdAt = {
        $gte: new Date(params.startTime),
        $lte: new Date(params.endTime)
      }
    }
    if (params.rakeByUsername) {
      query.userName = params.rakeByUsername;
    }
    
    const data = await this.rakebackPlayerHistory.count(query).exec()

    return data;
  }

  async countRakePlayerDataReportDataSearch (params) {
    console.log("inside countRakePlayerDataReportDataSearch", params);

    console.log("!params.rakeByUsername || !params.startDate || !params.endDate: ", !params.rakeByUsername || !params.startDate || !params.endDate);
    if (params.rakeByUsername || params.startDate || params.endDate) {
      var query: any = {};
      var queryTotal: any = {};
  
      if (params.startTime && !params.endTime) {
        query.startDate = params.startTime;
        queryTotal.startDate = params.startTime;
      }
      if (!params.startTime && params.endTime) {
        query.endDate = params.endTime;
        queryTotal.endDate = params.endTime;
      }
      if (params.startTime && params.endTime) {
        query.Timestamp = {
          $gte: new Date(params.startTime),
          $lte: new Date(params.endTime)
        }
      }
      if (params.rakeByUsername) {
        query.username = params.rakeByUsername;
      }
      if (params.rakeByTableName) {
        query.TableName = params.rakeByTableName;
      }
      if (params.rakeByHandId) {
        query.HandId = params.rakeByHandId;
      }
  
      const countData = await this.rakeReport.count(query);
      return countData;
    } else {
      throw new BadRequestException('No data found')
    }
  }


  async currentCycleRakeBack (params) {
    console.log("inside currentCycleRakeBack", params);
    var query: any = {}
  
    query.skip = params.skip;
    query.limit = params.limit;
    query.rakeByUsername = params.rakeByUsername;

    const getDataRakeHistoryByDate = await this.rakebackHistory.findOne({}).sort({ _id: -1 }).exec();
    if (getDataRakeHistoryByDate) {
      query.startDate = getDataRakeHistoryByDate.to;
      query.endDate = new Date()
      return await this.rakePlayerReport(query);
    }
  }

  async getRakeToAdmin (params) {
    console.log("inside getRakeToAdmin", params);
    return this.rakeReport.aggregate([
      {
        $group: {
          _id: "",
          rakeToAdmin: {
            $sum: "$RakeToAdmin"
          }
        }
      }
    ])
  }

  async getRakeFrom1stLine (params) {
    console.log("inside getRakeFrom1stLine", params);
    return this.rakeReport.aggregate([
      {
        $group: {
          _id: "",
          RakeFrom1StLine: {
            $sum: "$RakeTo1StLine"
          }
        }
      }
    ])
  }

  async getRakeFrom1stLineReject (params) {
    console.log("inside getRakeFrom1stLineReject", params);
    let query: any = {};
    query.firstStatus = "rejected";
    return this.rakeReport.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "",
          RakeFrom1StLine: {
            $sum: "$RakeTo1StLine"
          }
        }
      }
    ])
  }

  async getRakeFrom1stLineApproved (params) {
    console.log("inside getRakeFrom1stLineReject", params);
    let query: any = {};
    query.firstStatus = "approved";
    return this.rakeReport.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "",
          RakeFrom1StLine: {
            $sum: "$RakeTo1StLine"
          }
        }
      }
    ])
  }

  async getRakeFrom2ndLine (params) {
    console.log("inside getRakeFrom2ndLine", params);
    return this.rakeReport.aggregate([
      {
        $group: {
          _id: "",
          RakeFrom2ndLine: {
            $sum: "$RakeTo2ndLine"
          }
        }
      }
    ])
  }

  async getRakeFrom2ndLineReject (params) {
    console.log("inside getRakeFrom2ndLineReject", params);
    let query: any = {};
    query.secondStatus = "rejected";
    return this.rakeReport.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "",
          RakeFrom2ndLine: {
            $sum: "$RakeTo2ndLine"
          }
        }
      }
    ])
  }
  async getRakeFrom2ndLineApproved (params) {
    console.log("inside getRakeFrom2ndLineReject", params);
    let query: any = {};
    query.secondStatus = "approved";
    return this.rakeReport.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "",
          RakeFrom2ndLine: {
            $sum: "$RakeTo2ndLine"
          }
        }
      }
    ])
  }

}
