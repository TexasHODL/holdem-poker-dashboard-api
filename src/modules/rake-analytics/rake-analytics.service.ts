import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FundrakeService } from '../finance/services/fundrake/fundrake.service';
import { AffiliateService } from '../user/services/affiliate/affiliate.service';
import { UserService } from '../user/user.service';
import { CreateRakeAnalyticDto } from './dto/create-rake-analytic.dto';
import { UpdateRakeAnalyticDto } from './dto/update-rake-analytic.dto';
import _ from 'underscore';
import { TableService } from '../table/table.service';
import { parseStringToObjectId } from '@/shared/helpers/mongoose';

@Injectable()
export class RakeAnalyticsService {
  constructor(
    @Inject(FundrakeService)
    protected readonly fundrakeService: FundrakeService,
    @Inject(AffiliateService)
    protected readonly affiliateService: AffiliateService,
    @Inject(UserService)
    protected readonly userService: UserService,
    @Inject(TableService)
    protected readonly tableService: TableService,
  ) {}

  async listRakeDataRakeReport(params) {
    console.log('inside listRakeDataForRakeReport ', params);
    // if (!params.startDate || !params.endDate) {
    //   throw new BadRequestException('start date or end date missing!');
    // } else {
    //   const query: any = {};
    //   if (params.startDate && params.endDate) {
    //     query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    //   }
    //   if (params.rakeByUsername) {
    //     query.rakeByUsername = params.rakeByUsername;
    //   }
    //   query.sortValue = params.sortValue;
    //   query.skip = params.skip;
    //   query.limit = params.limit;
    //   console.log("query: ", query);
    //   const result = await this.findRakeDataDescending(query);
    //   console.log("result: ", result);
    //   if (result) {
    //     query.skip = 0;
    //     query.limit = 0;
    //     const result1 = await this.findRakeDataDescending(query);
    //     if (result1) {
    //       var totalRake = 0;
    //       var totalRakeToAdmin = 0;
    //       var totalRakeToAffiliate = 0;
    //       var totalRakeToSubAffiliate = 0;
    //       for (var i = 0; i < result1.length; i++) {
    //         totalRake = totalRake + result1[i].amount;
    //         if (result1[i].debitToCompany)
    //           totalRakeToAdmin += result1[i].debitToCompany;
    //         if (result1[i].debitToAffiliateamount)
    //           totalRakeToAffiliate += result1[i].debitToAffiliateamount;
    //         if (result1[i].debitToSubaffiliateamount)
    //           totalRakeToSubAffiliate += result1[i].debitToSubaffiliateamount;
    //       }
    //       return {
    //         success: true,
    //         totalRake: totalRake,
    //         totalRakeToAdmin: totalRakeToAdmin,
    //         totalRakeToAffiliate: totalRakeToAffiliate,
    //         totalRakeToSubAffiliate: totalRakeToSubAffiliate,
    //         result: result,
    //       };
    //     } else {
    //       throw new HttpException('Unable to get rake data result!', 500);
    //     }
    //   } else {
    //     throw new HttpException('Unable to get rake data result!', 500);
    //   }
    // }

    let query: any = {};
    if (params.startDate && params.endDate) {
      query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.rakeByUsername) {
      query.rakeByUsername = params.rakeByUsername;
    }
    if (params.sortValue) {
      query.sortValue = params.sortValue;
    } else {
      query.sortValue = 'addeddate';
    }
    query.skip = params.skip;
    query.limit = params.limit;
    console.log("query: ", query);
    const result = await this.findRakeDataDescending(query);
    if (result.length > 0) {
      query.skip = 0;
      query.limit = 0;
      const result1 = await this.findRakeDataDescending(query);
      if (result1) {
        var totalRake = 0;
        var totalRakeToAdmin = 0;
        var totalRakeToAffiliate = 0;
        var totalRakeToSubAffiliate = 0;
        for (var i = 0; i < result1.length; i++) {
          totalRake = totalRake + result1[i].amount;
          if (result1[i].debitToCompany)
            totalRakeToAdmin += result1[i].debitToCompany;
          if (result1[i].debitToAffiliateamount)
            totalRakeToAffiliate += result1[i].debitToAffiliateamount;
          if (result1[i].debitToSubaffiliateamount)
            totalRakeToSubAffiliate += result1[i].debitToSubaffiliateamount;
        }
        return {
          success: true,
          totalRake: totalRake,
          totalRakeToAdmin: totalRakeToAdmin,
          totalRakeToAffiliate: totalRakeToAffiliate,
          totalRakeToSubAffiliate: totalRakeToSubAffiliate,
          result: result,
        };
      } else {
        throw new HttpException('Unable to get rake data result!', 500);
      }
    } else {
      throw new HttpException('user not found', 500);
    }
  }

  findRakeDataDescending(params) {
    console.log('inside findRakeDataDescending ', params);
    return this.fundrakeService.getRakeDataDescending(params);
  }

  async countRakeDataForRakeReport(params) {
    console.log('inside countRakeDataForRakeReport ', params);
    // if (!params.startDate || !params.endDate) {
    //   throw new BadRequestException(' start date or end date missing!');
    // } else {
    //   const query: any = {};
    //   query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    //   if (params.rakeByUsername) {
    //     query.rakeByUsername = params.rakeByUsername;
    //   }
    //   return this.fundrakeService.getRakeDataCount(query);
    // }

    const query: any = {};
    if (params.startDate && params.endDate) {
      query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.rakeByUsername) {
      query.rakeByUsername = params.rakeByUsername;
    }
    const checkUser = await this.findRakeDataDescending(query);
    if (checkUser.length > 0) {
      return await this.fundrakeService.getRakeDataCount(query);
    }
  }

  async generateDailyRakeChartProcess(params) {
    console.log('inside generateDailyRakeChartProcess ', params);
    await this.findRakeForCurrentMonth(params);
    await this.filterRakeDataForCurrentMonth(params);
    await this.findRakeForPrevMonth(params);
    await this.filterRakeDataForPrevMonth(params);
    return params;
  }

  async findDailyRakeChart(params) {
    console.log('Inside findDailyRakeChart the params is !!', params.startDate);
    var selectedDate = params.addeddate; // contains 1 Aug 2017 if any date from aug month is selected
    var nextMonthDate; // cover all days of august month
    nextMonthDate = new Date(params.addeddate);
    nextMonthDate = nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    nextMonthDate = Number(nextMonthDate);
    console.log('the next month date is ', nextMonthDate);
    var query: any = {};
    query.addeddate = { $gte: selectedDate, $lt: nextMonthDate };
    params.startDate = selectedDate;
    params.endDate = nextMonthDate;
    console.log("query: ", query);
    return this.fundrakeService.findTotalRake(query);
  }

  async findRakeForCurrentMonth(params) {
    const result = await this.findDailyRakeChart(params);
    params.rakeData = result;
  }

  /**
   * This method find the rake data for current month on the daily basis.
   *
   * @method filterRakeDataForCurrentMonth
   */
  async filterRakeDataForCurrentMonth(params) {
    const result = await this.createRakeDataToDailyRakeData(params);
    console.log("resultfilterRakeDataForCurrentMonth ", result);
    params.currentMonthRakeData = result;
  }

  async findRakeForPrevMonth(params) {
    console.log('\n\n\n\n\n\n', params.addeddate, '\n\n\n\n\n\n\n');
    params.addeddate = new Date(params.addeddate);
    params.addeddate = params.addeddate.setMonth(
      params.addeddate.getMonth() - 1,
    );
    params.addeddate = Number(params.addeddate);
    const result = await this.findDailyRakeChart(params);
    params.rakeData = result;
  }

  /**
   * This method find the rake for previous month on daily basis.
   *
   * @method filterRakeDataForPrevMonth
   */
  async filterRakeDataForPrevMonth(params) {
    const result = this.createRakeDataToDailyRakeData(params);
    params.previousMonthRakeData = result;
  }

  /**
   * This method converts the rake data to daily rake data.The data we have obitained from the database
   * is converted to daily rake data by applying a for loop in the date and filtering that rake
   * data on daily basis.
   *
   * @method createRakeDataToDailyRakeData
   * @param  {Object}                      params [query object]
   * @param  {Function}                    cb     [callback as a response]
   * @return {Number}                             [the rake data on daily basis]
   */
  createRakeDataToDailyRakeData(params) {
    console.log("createRakeDataToDailyRakeData: ", params);
    var dailyRakeData = [];
    var i = 0;
    for (var tempCheck = params.startDate; tempCheck < params.endDate; tempCheck += (24 * 60 * 60 * 1000)) {
      var dailyRake = 0;
      var dailyAllRake = 0;
      for (var tempObj in params.rakeData) {
        if (params.rakeData[tempObj].addeddate >= tempCheck && params.rakeData[tempObj].addeddate < (tempCheck + (24 * 60 * 60 * 1000))) {
          if (params.filter == 'players' || params.filter == 'table') {
            dailyRake = dailyRake + params.rakeData[tempObj].amount;
          } else {
            if (!params.userType) {
            }
            if (params.userType == 'SUB-AFFILIATE') {
              dailyRake = dailyRake + params.rakeData[tempObj].debitToSubaffiliateamount;
            }
            if (params.userType == 'AFFILIATE') {
              dailyRake = dailyRake + params.rakeData[tempObj].debitToAffiliateamount;
            }
          }
          dailyAllRake = dailyAllRake + params.rakeData[tempObj].amount;
        }
      }
      var userName = '';
      if (params.filterAffiliate) {
        userName = params.filterAffiliate;
      } else if (params.filterPlayer) {
        userName = params.filterPlayer;
      } else if (params.filter == 'table') {
        userName = params.channelName;
      } else if (params.filter == 'gameVariation') {
        userName = params.rakeRefVariation;
      } else {
        userName = params.userName;
      }
      if (dailyRake > 0 || dailyAllRake > 0) {
        dailyRakeData[i++] = {userName: userName, date: tempCheck, dailyRake: parseFloat((dailyRake).toFixed(2)), dailyAllRake: parseFloat((dailyAllRake).toFixed(2))};
      }
    }

    dailyRakeData.sort(function (a, b) {
      return parseFloat(b.date) - parseFloat(a.date);
    });
    console.log('result ==== ', dailyRakeData.length);
    console.log("dailyRakeData: ", dailyRakeData);
    params.currentMonthRakeData = dailyRakeData
    return dailyRakeData;
  }

  async getRakeDataCountByDate(params) {
    console.log('inside getRakeDataCount', params);
    const filter: any = {};
    if (params.filter == 'affiliates' || params.filter == 'self') {
      filter['role.level'] = { $in: [0, -1] };
      if (params.filterAffiliate) {
        filter.userName = eval('/^' + params.filterAffiliate + '$/i');
      }

      if (params.parentUser) {
        filter.parentUser = params.parentUser;
      }
      const result = await this.affiliateService.getAffiliateCount(filter);
      if (!result) {
        throw new BadRequestException('No data found.');
      }
      return result;
    } else {
      if (params.filterPlayer) {
        filter.userName = eval('/^' + params.filterPlayer + '$/i');
      }
      if (params.isParentUserName) {
        filter.isParentUserName = params.isParentUserName;
      }
      const result = await this.userService.findAllPlayersCount(filter);
      if (!result) {
        throw new BadRequestException('Unable to find player.');
      }
      return result;
    }
  }


  async getAllPlayersCountByDate (params) {
    console.log('inside getAllPlayersCountByDate == ', params);
    const query: any = {};
    if (params.filter == 'players' && params.filterPlayer) {
      query.userName = eval('/^' + params.filterPlayer + '$/i');
      if (params.isParentUserName) {
        query.isParentUserName = params.isParentUserName;
      }
    }

    if (params.isParentUserName && !params.filterPlayer) {
      if (params.isParentUserName) {
        query.isParentUserName = params.isParentUserName;
      }
      params.parentUser = params.isParentUserName;
    }
    // query.skip = params.skip;
    // query.limit = params.limit;
    console.log('query == ', query);
    const result = await this.userService
    .findAll(query, {userName: 1})
    // .limit(params.limit)
    // .skip(params.skip);
    
    const resultRake = await this.userService
    .findAll(query, {userName: 1})
    
    if (result && result.length > 0) {
      params.playersArray = result.map((it) => it.toObject());
      // params.playersArray = resultRake.map((it) => it.toObject());
      return params;
    } else {
      throw new BadRequestException('Unable to find player!');
    }
  }

  async getAllPlayers(params) {
    console.log('inside getAllPlayers == ', params);
    const query: any = {};
    if (params.filter == 'players' && params.filterPlayer) {
      query.userName = eval('/^' + params.filterPlayer + '$/i');
      if (params.isParentUserName) {
        query.isParentUserName = params.isParentUserName;
      }
    }

    if (params.isParentUserName && !params.filterPlayer) {
      if (params.isParentUserName) {
        query.isParentUserName = params.isParentUserName;
      }
      params.parentUser = params.isParentUserName;
    }
    // query.skip = params.skip;
    // query.limit = params.limit;
    console.log('query == ', query);
    const result = await this.userService
    .findAll(query, {userName: 1})
    .limit(params.limit)
    .skip(params.skip);
    
    const resultRake = await this.userService
    .findAll(query, {userName: 1})
    
    if (result && result.length > 0) {
      params.playersArray = result.map((it) => it.toObject());
      // params.playersArray = resultRake.map((it) => it.toObject());
      return params;
    } else {
      throw new BadRequestException('Unable to find player!');
    }
  }

  async getAllAffiliatesAndSubAffiliatesCountByDate(params) {
    console.log('inside getAllAffiliatesAndSubAffiliatesCountByDate == ', params);
    const query: any = {};
    if (params.filter == 'affiliates') {
      query['role.level'] = { $in: [0, -1] };
      if (params.filterAffiliate) {
        query.userName = eval('/^' + params.filterAffiliate + '$/i');
      }
      if (params.parentUser) {
        query.parentUser = params.parentUser;
      }
    }

    if (params.parentUser) {
      if (params.filter == 'self') {
        query.userName = eval('/^' + params.parentUser + '$/i');
      } else {
        query.parentUser = eval('/^' + params.parentUser + '$/i');
      }
    }

    // query.skip = params.skip || 0;
    // query.limit = params.limit || 0;
    console.log('query ', query);
    var projectionData = {
      userName: 1,
      role: 1,
      rakeCommision: 1,
      parentUser: 1,
      userType: 1,
    };
    const result = await this.affiliateService
    .findAll(query, null)
    .skip(params.skip || 0)
    .limit(params.limit || 0);
    console.log("result====== ", result);
    
    if (
      (result && result.length > 0) ||
      (params.playersArray && params.playersArray.length > 0)
    ) {
      params.affiliatesArray = result.map((it) => it.toObject());
      return params;
    } else {
      throw new BadRequestException('Unable to find affiliate!');
      // console.log("Unable to find affiliate!");
      params.affiliatesArray = [];
      return params;
    }
  }

  async getAllAffiliatesAndSubAffiliates(params) {
    console.log('inside getAllAffiliatesAndSubAffiliates == ', params);
    const query: any = {};
    if (params.filter == 'affiliates') {
      query['role.level'] = { $in: [0, -1] };
      if (params.filterAffiliate) {
        query.userName = eval('/^' + params.filterAffiliate + '$/i');
      }
      // if (params.parentUser) {
      //   query.parentUser = params.parentUser;
      // }
    }

    if (params.parentUser) {
      if (params.filter == 'self') {
        query.userName = eval('/^'+ params.parentUser +'$/i');
      } else {
        query.parentUser = eval('/^'+ params.parentUser +'$/i');
      }
    }

    // query.skip = params.skip || 0;
    // query.limit = params.limit || 0;
    console.log('query ', query);
    var projectionData = {
      userName: 1,
      role: 1,
      rakeCommision: 1,
      parentUser: 1,
      userType: 1,
    };
    const result = await this.affiliateService
    .findAll(query, null)
    .skip(params.skip || 0)
    .limit(params.limit || 0);
    console.log("result====== ", result);
    
    if (
      (result && result.length > 0) ||
      (params.playersArray && params.playersArray.length > 0)
    ) {
      params.affiliatesArray = result.map((it) => it.toObject());
      return params;
    } else {
      // throw new BadRequestException('Unable to find affiliate!');
      // console.log("Unable to find affiliate!");
      params.affiliatesArray = [];
      return params;
    }
  }

  async getPlayersFromSubAffiliate(params) {
    console.log('\n\n\n\n\n\n\n********', params.playersArray.length);
    if (params.userRole.level > 0) {
      return params;
    }
    if (params.filterPlayer) {
      return params;
    } else {
      for (let affiliate of params.affiliatesArray) {
        try {
          let result = await this.getAllPlayers({
            isParentUserName: affiliate.userName,
            skip: 0,
            limit: 0,
          });
          if (!result) {
            params.playersArray = _.union(
              params.playersArray,
              result.playersArray,
            );
          }
        } catch (err) {
          // todo
        }
      }
    }
  }

  async calculateRakeFromPlayers(params) {
    console.log(
      'inside calculateRakeFromPlayers == ',
      params.playersArray.length,
    );
    for (let player of params.playersArray) {
      var query: any = {
        rakeByUsername: player.userName,
      };
      if (params.addeddate) {
        var endDate = params.addeddate + 24 * 60 * 60 * 1000;
        query.addeddate = { $gte: params.addeddate, $lt: endDate };
      }

      if (params.startDateForTop && params.endDateForTop) {
        query.addeddate = {
          $gte: params.startDateForTop,
          $lt: params.endDateForTop,
        };
      }

      var totalRake = 0;

      console.log("query==== ", query);
      const result = await this.fundrakeService.getRakeData(query);
      console.log("result========== ", result);

      for (var i = 0; i < result.length; i++) {
        totalRake = totalRake + result[i].amount;
      }
      player.userType = 'PLAYER';
      player.totalRake = parseFloat(totalRake.toFixed(2));
    }
  }

  async rakeDataProcessPlayerByDate(params) {
    console.log('inside rakeDataProcessPlayer ', params);
    await this.getAllPlayers(params);
    await this.getAllAffiliatesAndSubAffiliates(params);
    await this.getPlayersFromSubAffiliate(params);
    await this.calculateRakeFromPlayers(params);
    const uniquePlayersResult = _.uniq(
      params.playersArray,
      false,
      function (p) {
        return p.userName;
      },
    );
    params.playersArray = uniquePlayersResult;
    console.log("params===== ", params);
    return params;
  }

  async countRake (params) {
    // await this.countTotalRake(params);
    // return params;
    console.log("inside countRake", params);
    
    await this.getAllPlayersCountByDate(params);
    await this.getAllAffiliatesAndSubAffiliatesCountByDate(params);
    await this.getPlayersFromSubAffiliate(params);
    await this.calculateRakeFromPlayers(params);
    const uniquePlayersResult = _.uniq(
      params.playersArray,
      false,
      function (p) {
        return p.userName;
      },
    );
    params.playersArray = uniquePlayersResult;
    console.log("params===== ", params);
    return params;
  }

  async countTotalRake (params) {
    let query: any = {}
    var totalRake = 0;

    if (params.addeddate) {
      var endDate = params.addeddate + 24 * 60 * 60 * 1000;
      query.addeddate = { $gte: params.addeddate, $lt: endDate };
    }

    const result = await this.fundrakeService.getRakeData(query);
    console.log("result========== ", result);

    for (var i = 0; i < result.length; i++) {
      totalRake = totalRake + result[i].amount;
    }
    params.totalRake = parseFloat(totalRake.toFixed(2));
  }

  async checkPlayerExists(params) {
    console.log('inside checkPlayerExists ', params);
    const result = await this.userService.findOne({
      userName: eval('/^' + params.filterPlayer + '$/i'),
    });
    console.log("result1 ", result);
    if (!result) {
      throw new BadRequestException('Player not found!');
    }

    params.filterPlayer = result.userName;
    if (params.parentUser) {
      if (result.isParentUserName == params.parentUser) {
        return params;
      }
      const result1: any = await this.affiliateService.findOne({
        userName: result.isParentUserName,
      });
      console.log("result2: ", result1);
      if (!result1 || result1.parentUser !== params.parentUser) {
        throw new BadRequestException(
          'Player not found for logged in affiliate!',
        );
      }
    }
    return params;
  }

  async rakeDataProcessAffiliatesByDate(params) {
    console.log('inside rakeDataProcessAffiliates ', params);
    await this.checkUserExists(params);
    await this.getAllAffiliatesAndSubAffiliates(params);
    return await this.calculateRakeFromAffiliates(params);
  }

  async checkUserExists(params) {
    console.log('inside checkUserExists == ', params);
    if (params.filter == 'players') {
      await this.checkPlayerExists(params);
      return params;
    } else if (params.filter == 'affiliates') {
      if (!params.filterAffiliate) {
        return params;
      }
      await this.checkAffiliateExists(params);
      return params;
    }
  }

  async checkAffiliateExists(params) {
    console.log('inside checkAffiliateExists ', params);
    var query: any = {};
    query.userName = eval('/^' + params.filterAffiliate + '$/i');
    if (params.userRole && params.userRole.level == 0) {
      query.parentUser = params.loggedInUser;
    }
    const result: any = await this.affiliateService.findOne(query);
    if (result) {
      if (result.role.level == 0) {
        params.userType = 'AFFILIATE';
      }
      if (result.role.level == -1) {
        params.userType = 'SUB-AFFILIATE';
      }
      return params;
    }
    throw new BadRequestException('Affiliate/Sub-Affiliate not found!');
  }

  async calculateRakeFromAffiliates(params) {
    console.log(
      'inside calculateRakeFromAffiliates == ',
      params.affiliatesArray,
    );
    try {
      for (let affiliate of params.affiliatesArray) {
        const query: any = {};
        if (affiliate.role.level == 0) {
          query.debitToAffiliatename = affiliate.userName;
          affiliate.userType = 'AFFILIATE';
        }
        if (affiliate.role.level == -1) {
          query.debitToSubaffiliatename = affiliate.userName;
          affiliate.userType = 'SUB-AFFILIATE';
        }
        if (params.addeddate) {
          var endDate = params.addeddate + 24 * 60 * 60 * 1000;
          query.addeddate = { $gte: params.addeddate, $lt: endDate };
        }
        if (params.startDateForTop && params.endDateForTop) {
          query.addeddate = {
            $gte: params.startDateForTop,
            $lt: params.endDateForTop,
          };
        }
        var totalRake = 0;
        console.log('\n\n\n\n\n', query, '\n\n\n\n\n');
        const result = await this.fundrakeService.getRakeData(query);
        for (var i = 0; i < result.length; i++) {
          totalRake = totalRake + result[i].amount;
        }
        affiliate.totalRake = parseFloat(totalRake.toFixed(2));
      }
    } catch (err) {
      params.affiliatesArray.sort(function (a, b) {
        return parseFloat(b.totalRake) - parseFloat(a.totalRake);
      });
    }
    return params;
  }

  async findRakeDetailFromPlayer(params) {
    console.log('inside findRakeDetailFromPlayer ', params);
    const query: any = {};
    query.rakeByUsername = eval('/^' + params.filterPlayer + '$/i');
    query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    const result = await this.fundrakeService.getRakeData(query);
    console.log("resultfindRakeDetailFromPlayer ", result);
    params.rakeData = result;
  }

  async rakeDataProcessPlayerByPlayerOrAffiliate(params) {
    console.log('inside rakeDataProcessPlayerByPlayerOrAffiliate ', params);
    await this.checkPlayerExists(params);
    await this.findRakeDetailFromPlayer(params);
    const result = await this.createRakeDataToDailyRakeData(params);
    console.log("result============== ", result);
    return {
      result,
      totalRake: result.reduce((prev, item) => prev + item.dailyRake, 0),
    };
    // async.waterfall([
    //   async.apply(checkPlayerExists, params),
    //   findRakeDetailFromPlayer,
    //   createRakeDataToDailyRakeData
    // ], function (err, result) {
    //   if (!err && result) {
    //     return res.json({success: true, result: result});
    //   } else {
    //     return res.json({success: false, info: err.info});
    //   }
    // });
  }

  async getAllCashTables(params) {
    console.log('inside getAllCashTables ', params);
    const query: any = {};
    if (params.skip) {
      query.skip = params.skip;
    }
    if (params.limit) {
      query.limit = params.limit;
    }
    query.isRealMoney = true;
    if (params.isRealMoney) {
      query.isRealMoney = JSON.parse(params.isRealMoney);
    }
    const result = await this.tableService.findTable(query);
    if (result && result.length > 0) {
      params.tablesArray = result.map((x) => x.toObject());
      return params;
    } else {
      throw new BadRequestException('No table found!');
    }
  }

  async getAllCashTablesProcess(params) {
    console.log('inside getAllCashTablesProcess ', params);
    const result = await this.getAllCashTables(params);
    return result.tablesArray;
  }

  async findRakeDataByGameVariation(params) {
    // if (!params.startDate || !params.endDate) {
    //   throw new BadRequestException('start date or end date missing!');
    // } else {
    //   const query: any = {};
    //   query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    //   query.rakeRefVariation = params.rakeRefVariation;
    //   // query.sortValue = 'addeddate';
    //   var skip = params.skip || 0;
    //   var limit = params.limit || 0;
    //   var sortValue = 'addeddate';
    //   const result = await this.fundrakeService
    //     .findAll(query)
    //     .skip(skip)
    //     .limit(limit)
    //     .sort({ [sortValue]: -1 });
    //   params.filter = 'gameVariation';
    //   params.rakeData = result;
    //   return params;
    // }
    const query: any = {};
    query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    query.rakeRefVariation = params.rakeRefVariation;
    // query.sortValue = 'addeddate';
    var skip = params.skip || 0;
    var limit = params.limit || 0;
    var sortValue = 'addeddate';
    const result = await this.fundrakeService
      .findAll(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortValue]: -1 });
    params.filter = 'gameVariation';
    params.rakeData = result;
    return params;
  }

  async listRakeDataByGameVariantProcess(params) {
    console.log('inside listRakeDataByGameVariantProcess ', params);
    await this.findRakeDataByGameVariation(params);
    const result = await this.createRakeDataToDailyRakeData(params);
    return {
      result,
      totalRake: result.reduce((prev, item) => prev + item.dailyAllRake, 0),
    };
  }

  async getAllRakeData(params) {
    const query: any = {};
    query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    const result = await this.fundrakeService.getRakeData(query);
    if (result) {
      params.rakeData = result;
      return params;
    }
    throw new BadRequestException(
      'Unable to find rake details for this affiliate!',
    );
  }

  filterRakeDataToHalfHourlyRakeData(params) {
    console.log('inside filterRakeDataToHalfHourlyRakeData ', params.filter);
    var hourlyRakeData = [];
    var i = 0;
    for (
      var tempCheck = params.startDate;
      tempCheck < params.endDate;
      tempCheck += 0.5 * 60 * 60 * 1000
    ) {
      var hourlyAllRake = 0;
      for (var tempObj in params.rakeData) {
        if (
          params.rakeData[tempObj].addeddate >= tempCheck &&
          params.rakeData[tempObj].addeddate < tempCheck + 0.5 * 60 * 60 * 1000
        ) {
          hourlyAllRake = hourlyAllRake + params.rakeData[tempObj].amount;
        }
      }
      hourlyRakeData[i++] = {
        date: tempCheck,
        hourlyAllRake: parseFloat(hourlyAllRake.toFixed(2)),
      };
    }
    hourlyRakeData.sort(function (a, b) {
      return parseFloat(b.date) - parseFloat(a.date);
    });
    return hourlyRakeData;
  }

  async generateRakeChartByTimeProcess(params) {
    console.log('inside generateRakeChartByTimeProcess ', params);
    await this.getAllRakeData(params);
    return await this.filterRakeDataToHalfHourlyRakeData(params);
  }

  async findAllRakeFromAffiliates(params) {
    console.log('inside calculateRakeFromAffiliates == ', params.affiliatesArray[0].role);
    for (let affiliate of params.affiliatesArray) {
      const query: any = {};
      if (affiliate.role.level == 0) {
        query.debitToAffiliatename = affiliate.userName;
        affiliate.userType = 'AFFILIATE';
        affiliate.parentUser = 'N/A';
      }
      if (affiliate.role.level == -1) {
        query.debitToSubaffiliatename = affiliate.userName;
        affiliate.userType = 'SUB-AFFILIATE';
      }
      if (params.startDate && !params.endDate) {
        query.addeddate = { $gte: params.startDate };
      }
      if (params.endDate && !params.startDate) {
        query.addeddate = { $lt: params.endDate };
      }
      if (params.endDate && params.startDate) {
        query.addeddate = { $gte: params.startDate, $lt: params.endDate };
      }
      var totalRake = 0;
      console.log("queryfindAllRakeFromAffiliates ", query);
      const result = await this.fundrakeService.getRakeData(query);
      console.log("resultData ", result);
      affiliate.rakeData = result;
    }
  }

  createStartDateEndDate(params) {
    console.log('**************');
    var startDate, endDate;

    startDate = new Date(
      _.min(params.rakeData, function (rakeElement) {
        return rakeElement.addeddate;
      }).addeddate,
    );
    endDate = new Date(
      _.max(params.rakeData, function (rakeElement) {
        return rakeElement.addeddate;
      }).addeddate,
    );
    console.log('createStartDateEndDate ', startDate, endDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(999);
    params.startDate = Number(startDate) || 0;
    params.endDate = Number(endDate) || 0;
    console.log(
      '\ncreateStartDateEndDate ',
      startDate,
      endDate,
      params.userName,
    );
    return params;
  }

  async assignStartEndDateToRakeData(params) {
    console.log('assignStartEndDateToRakeData == ', params);
    for (let affiliate of params.affiliatesArray) {
      if (affiliate.rakeData.length > 0) {
        const result = await this.createStartDateEndDate(affiliate);
      }
    }
    return params;
  }

  async filterRakeDataToDailyRakeData(params) {
    console.log("filterRakeDataToDailyRakeData: ", params);
    for (let affiliate of params.affiliatesArray) {
      console.log("affiliatefilterRakeDataToDailyRakeData ", affiliate);
      if (affiliate.rakeData.length > 0) {
        const result = await this.createRakeDataToDailyRakeData(affiliate);
        console.log("resultfilterRakeDataToDailyRakeData ", result);
        affiliate.dailyRakeData = result;
        delete affiliate.rakeData;
      }
    }
    return params.affiliatesArray;
  }

  async rakeDataProcessDatewise(params) {
    console.log('inside rakeDataProcessDatewise ', params);
    await this.getAllAffiliatesAndSubAffiliates(params);
    await this.findAllRakeFromAffiliates(params);
    await this.assignStartEndDateToRakeData(params);
    let result = await this.filterRakeDataToDailyRakeData(params);
    console.log("paramsrakeDataProcessDatewise ", result[1]);
    if (params.containsFilters) {
      if (params.minRake) {
        for (var i = 0; i < result.length; i++) {
          result[i].dailyRakeData = _.filter(
            result[i].dailyRakeData,
            function (rakeElement) {
              return rakeElement.dailyAllRake >= params.minRake;
            },
          );
        }
      }
      if (params.maxRake) {
        for (var i = 0; i < result.length; i++) {
          result[i].dailyRakeData = _.filter(
            result[i].dailyRakeData,
            function (rakeElement) {
              return rakeElement.dailyAllRake <= params.maxRake;
            },
          );
        }
      }
      if (params.minCommission) {
        for (var i = 0; i < result.length; i++) {
          result[i].dailyRakeData = _.filter(
            result[i].dailyRakeData,
            function (rakeElement) {
              return rakeElement.dailyRake >= params.minCommission;
            },
          );
        }
      }
      if (params.maxCommission) {
        for (var i = 0; i < result.length; i++) {
          result[i].dailyRakeData = _.filter(
            result[i].dailyRakeData,
            function (rakeElement) {
              return rakeElement.dailyRake <= params.maxCommission;
            },
          );
        }
      }
      if (params.minCommissionPercent) {
        result = _.filter(result, function (rakeElement) {
          return rakeElement.rakeCommision >= params.minCommissionPercent;
        });
      }
      if (params.maxCommissionPercent) {
        result = _.filter(result, function (rakeElement) {
          return rakeElement.rakeCommision <= params.maxCommissionPercent;
        });
      }
    }
    // console.log("result======================++ ", result);
    return result;
  }

  async getCashTablesCount(params) {
    console.log('inside getCashTablesCount ', params);
    const result = await this.countlistTable({});
    return result;
  }

  countlistTable(query) {
    console.log('in listTable count dbQuery', query);
    // serverLog(
    //   stateOfX.serverLogType.dbQuery,
    //   ' Query while listing table - ' + JSON.stringify(query),
    // );
    if (query.channelType == 'TOURNAMENT') {
      // mongodb.db
      //   .collection('tournamentroom')
      //   .count(query, function (err, result) {
      //     callback(err, result);
      //   });
      return 0;
    } else {
      return this.tableService.count(query);
    }
  }

  async calculateRakeByOneTable(params) {
    const query: any = { channelId: params._id.toString() };
    if (params.startDateForTop && params.endDateForTop) {
      query.addeddate = {
        $gte: params.startDateForTop,
        $lt: params.endDateForTop,
      };
    }
    var rakeGenerated = 0;
    const result = await this.fundrakeService.findTotalRake(query);
    if (result) {
      for (var i = 0; i < result.length; i++) {
        rakeGenerated = rakeGenerated + result[i].amount;
      }
      rakeGenerated = parseFloat(rakeGenerated.toFixed(2));
      return rakeGenerated;
    } else {
      throw new BadRequestException(
        'Unable to find rake details from this table.',
      );
    }
  }

  async assignTotalRakeGeneratedToTable(params) {
    for (let table of params.tablesArray) {
      if (params.endDateForTop) {
        table.endDateForTop = params.endDateForTop;
      }

      if (params.startDateForTop) {
        table.startDateForTop = params.startDateForTop;
      }
      const result = await this.calculateRakeByOneTable(table);
      table.rakeGenerated = result;
    }
    return params.tablesArray;
  }

  async listEachCashTableRakeDataProcess(params) {
    console.log('inside listEachCashTableRakeDataProcess ', params);
    await this.getAllCashTables(params);
    const result = await this.assignTotalRakeGeneratedToTable(params);
    return {
      result,
      totalRake: result.reduce((prev, item) => prev + item.rakeGenerated, 0),
    };
  }

  async findRakeDetailFromAffiliate(params) {
    console.log('inside findRakeDetailFromAffiliate ', params);
    const query: any = {};
    if (params.userType == 'AFFILIATE') {
      query.debitToAffiliatename = eval('/^' + params.filterAffiliate + '$/i');
    }
    if (params.userType == 'SUB-AFFILIATE') {
      query.debitToSubaffiliatename = eval(
        '/^' + params.filterAffiliate + '$/i',
      );
    }
    query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    console.log('line 667 ', query);
    const result = await this.fundrakeService.getRakeData(query);
    if (result) {
      params.rakeData = result;
      return params;
    } else {
      throw new BadRequestException(
        'Unable to find rake details for this affiliate!',
      );
    }
  }

  async rakeDataProcessAffiliatesByPlayerOrAffiliate(params) {
    console.log('inside rakeDataProcessAffiliatesByPlayerOrAffiliate ', params);
    await this.checkAffiliateExists(params);
    await this.findRakeDetailFromAffiliate(params);
    const result = await this.createRakeDataToDailyRakeData(params);
    return {
      result,
      totalRake: result.reduce((prev, item) => prev + item.dailyRake, 0),
    };
  }

  async findRakeDataByCashTable (params) {
    const query: any = {};
    if (params.startDate && params.endDate) {
      query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.channelName) {
      query.channelName = params.channelName;
    }
    if (params.tableId) {
      query.channelId = params.tableId;
    }
    query.skip = params.skip ? params.skip : 0;
    query.limit = params.limit ? params.limit : 0;
    query.sortValue = 'addeddate';
    console.log("queryfindRakeDataByCashTable ", query);
    const result = await this.fundrakeService.getRakeDataDescending(query);
    console.log('queryquery', result, query);
    if (result) {
      params.filter = 'table';
      params.rakeData = result;
      return params;
    } else {
      throw new BadRequestException('Unable to get rake data result!');
    }
    // if (!params.startDate || !params.endDate) {
    //   throw new BadRequestException('start date or end date missing!');
    // } else {
    //   const query: any = {};
    //   query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    //   if (params.channelName) {
    //     query.channelName = params.channelName;
    //   }
    //   if (params.tableId) {
    //     query.channelId = params.tableId;
    //   }
    //   query.skip = params.skip ? params.skip : 0;
    //   query.limit = params.limit ? params.limit : 0;
    //   query.sortValue = 'addeddate';
    //   console.log("queryfindRakeDataByCashTable ", query);
    //   const result = await this.fundrakeService.getRakeDataDescending(query);
    //   console.log('queryquery', result, query);
    //   if (result) {
    //     params.filter = 'table';
    //     params.rakeData = result;
    //     return params;
    //   } else {
    //     throw new BadRequestException('Unable to get rake data result!');
    //   }
    // }
  }

  async countRakeDataByCashTable(params) {
    console.log('inside countRakeDataByCashTable ', params);
    if (!params.startDate || !params.endDate) {
      throw new BadRequestException('start date or end date missing!');
    } else {
      const query: any = {};
      query.addeddate = { $gte: params.startDate, $lt: params.endDate };
      if (params.tableName) {
        query.channelName = params.tableName;
      }
      if (params.tableId) {
        query.channelId = params.tableId;
      }
      const count = await this.fundrakeService.getRakeDataCount(query);
      console.log('countRakeDataByCashTable', query, count);
      if (count) return count;
      throw new BadRequestException('No data found!');
    }
  }

  async listRakeDataByCashTableProcess(params) {
    console.log('inside listRakeDataByCashTableProcess ', params);
    await this.findRakeDataByCashTable(params);
    console.log('params', params.rakeData);
    const result = await this.createRakeDataToDailyRakeData(params);
    return {
      result,
      totalRake: result.reduce((prev, item) => prev + item.dailyRake, 0),
    };
  }

  async listRakeBackMonthlyReport(params) {
    console.log('inside listRakeBackMonthlyReport function-->', params);
    let query: any = {};
    var selectedDate = params.addeddate; // contains 1 Aug 2017 if any date from aug month is selected
    var nextMonthDate;
    nextMonthDate = new Date(params.addeddate);
    nextMonthDate = nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    nextMonthDate = Number(nextMonthDate);
    query.addeddate = { $gte: selectedDate, $lt: nextMonthDate };

    if (params.name && params.name != '') {
      console.log("vao day ne");
      
      var parentName = eval('/^' + params.name + '$/i');
      query = {
        $or: [
          {
            addeddate: { $gte: selectedDate, $lt: nextMonthDate },
            debitToAffiliatename: parentName,
          },
          {
            addeddate: { $gte: selectedDate, $lt: nextMonthDate },
            debitToSubaffiliatename: parentName,
          },
        ],
      };
    }
    if (params.skip) query.skip = params.skip;
    if (params.limit) query.limit = params.limit;
    console.log('inside listRakeBackMonthlyReport query -->', query);
    let result = await this.fundrakeService.listRakeBackMonthlyReport(query);
    // function(err,result){
    //   if(err){
    //     return res.json({success : false , info : "Getting error while showing rake back monthly report"});
    //   }else{
    //   }
    // }

    if (result && result.length > 0) {
      // result = result.map((x) => x.toObject());
      for (let monthlyRakeResult of result) {
        const user = await this.userService.findOne({
          userName: eval('/^' + monthlyRakeResult._id + '$/i'),
        });
        if (user) {
          monthlyRakeResult.state = user.address.state;
        }
      }
      return result;
    } else {
      throw new BadRequestException('No records Found !!');
    }
  }

  /**
   * This method gives the count of rake data report for the affiliate.
   *
   * @method countRakeDataForRakeReportAffiliate
   * @param  {Object}                  req [a express request object]
   * @param  {Callback}                res [callback as a response]
   * @return {Object}                      [a JSON object containing success: Boolean, info: String,
   *                                          result: Object]
   */
  async countRakeDataForRakeReportAffiliate(params) {
    console.log('inside countRakeDataForRakeReportAffiliate ', params);
    if (!params.startDate || !params.endDate) {
      throw new BadRequestException( 'start date or end date missing!');
    } else {
      var query: any = {};
      let count = 0;
      query.addeddate = { $gte: params.startDate, $lt: params.endDate };
      if (params.rakeByUsername) {
        query.rakeByUsername = params.rakeByUsername;
      }
      if (params.role.level == 0) {
        const result = await this.getAllAffiliatesAndSubAffiliates(params);
        var subAffArray = [];
          if (result) {
            for (var i = 0; i < result.length; i++) {
              subAffArray[i] = result[i].userName;
            }
          }
          query['$or'] = [
            {
              debitToAffiliatename: params.parentUser,
            },
            {
              debitToSubaffiliatename: { $in: subAffArray },
            },
          ];
          count = await this.fundrakeService.getRakeDataCount(query);
      } else {
        query.debitToSubaffiliatename = params.parentUser;
        count = await this.fundrakeService.getRakeDataCount(query);
      }
      if (count === 0) {
        throw new BadRequestException('No data found');
      }
      return count;
    }
  };

  async countRakeDataForRakeReportAffiliates(params) {
    console.log('inside countRakeDataForRakeReportAffiliate ', params);
    var query: any = {};
    let count = 0;
    if (params.startDate && params.endDate) {
      query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.addeddate = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.addeddate = { $lt: params.endDate };
    }
    if (params.rakeByUsername) {
      query.rakeByUsername = params.rakeByUsername;
    }
    if (params.role.level == 0) {
      const result = await this.getAllAffiliatesAndSubAffiliates(params);
      var subAffArray = [];
        if (result) {
          for (var i = 0; i < result.affiliatesArray.length; i++) {
            subAffArray[i] = result.affiliatesArray[i].userName;
          }
        }
        query['$or'] = [
          {
            debitToAffiliatename: params.parentUser,
          },
          {
            debitToSubaffiliatename: { $in: subAffArray },
          },
        ];
        count = await this.fundrakeService.getRakeDataCount(query);
    } else {
      query.debitToSubaffiliatename = params.parentUser;
      count = await this.fundrakeService.getRakeDataCount(query);
    }
    if (count === 0) {
      throw new BadRequestException('No data found');
    }
    return count;
  };


  /**
   * This method list the rake data report for the affiliate.
   *
   * @method listRakeDataForRakeReportAffiliate
   * @param  {Object}                  req [a express request object]
   * @param  {Callback}                res [callback as a response]
   * @return {Object}                      [a JSON object containing success: Boolean, info: String,
   *                                          totalRake: Number, result: Object]
   */
  async listRakeDataForRakeReportAffiliate(params) {
    console.log('inside listRakeDataForRakeReportAffiliate ', params);
    if (!params.startDate || !params.endDate) {
      throw new BadRequestException( 'start date or end date missing!');
    } else {
      var query: any = {};
      query.addeddate = { $gte: params.startDate, $lt: params.endDate };
      if (params.rakeByUsername) {
        query.rakeByUsername = params.rakeByUsername;
      }
      if (params.role.level == 0) {
        const result = await this.getAllAffiliatesAndSubAffiliates(params);
        var subAffArray = [];
        if (result) {
          for (var i = 0; i < result.affiliatesArray.length; i++) {
            subAffArray[i] = result.affiliatesArray[i].userName;
          }
        }
        console.log('all sub-affiliates ', subAffArray);
        query['$or'] = [
          {
            debitToAffiliatename: params.parentUser,
          },
          {
            debitToSubaffiliatename: { $in: subAffArray },
          },
        ];
        query.skip = params.skip;
        query.limit = params.limit;
        query.sortValue = params.sortValue;

        const result1 = await this.findRakeDataDescending(query);
        if (result1) {
          query.skip = 0;
          query.limit = 0;
          const result2 = await this.findRakeDataDescending(query);
          if (result2) {
            var totalRake = 0;
            var totalRakeAffiliate = 0;
            for (var i = 0; i < result2.length; i++) {
              totalRake = totalRake + result2[i].amount;
              totalRakeAffiliate =
                totalRakeAffiliate +
                (result2[i].debitToAffiliateamount || 0);
            }
            return {
              totalRake: totalRake,
              result: result1,
              totalRakeAffiliate: totalRakeAffiliate,
            };
          } else {
            throw new BadRequestException('Unable to get rake data result!');
          }
        } else {
          throw new BadRequestException('Unable to get rake data result!');
        }
      } else {
        query.debitToSubaffiliatename = params.parentUser;
        query.skip = params.skip;
        query.limit = params.limit;
        const result = await this.findRakeDataDescending(query);
        if (result) {
          query.limit = 0;
          const result1 = await this.findRakeDataDescending(query);
          if (result1) {
            var totalRake = 0;
            var totalRakeSubAffiliate = 0;
            for (var i = 0; i < result1.length; i++) {
              totalRake = totalRake + result1[i].amount;
              totalRakeSubAffiliate =
                totalRakeSubAffiliate +
                (result1[i].debitToSubaffiliateamount || 0);
            }
            return {
              totalRake: totalRake,
              result: result,
              totalRakeSubAffiliate: totalRakeSubAffiliate,
            };
          } else {
            throw new BadRequestException('Unable to get rake data result!');
          }
        } else {
          throw new BadRequestException('Unable to get rake data result!');
        }
      }
    }
  };

  async listRakeDataForRakeReportAffiliates(params) {
    console.log('inside listRakeDataForRakeReportAffiliates ', params);
    var query: any = {};
    if (params.startDate && params.endDate) {
      query.addeddate = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.addeddate = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.addeddate = { $lt: params.endDate };
    }
    if (params.rakeByUsername) {
      query.rakeByUsername = params.rakeByUsername;
    }
    if (params.role.level == 0) {
      const result = await this.getAllAffiliatesAndSubAffiliates(params);
      console.log("result==== ", result);
      var subAffArray = [];
      if (result) {
        for (var i = 0; i < result.affiliatesArray.length; i++) {
          subAffArray[i] = result.affiliatesArray[i].userName;
        }
      }
      console.log('all sub-affiliates ', subAffArray);
      query['$or'] = [
        {
          debitToAffiliatename: params.parentUser,
        },
        {
          debitToSubaffiliatename: { $in: subAffArray },
        },
      ];
      query.skip = params.skip;
      query.limit = params.limit;
      query.sortValue = params.sortValue;

      const result1 = await this.findRakeDataDescending(query);
      if (result1) {
        query.skip = 0;
        query.limit = 0;
        const result2 = await this.findRakeDataDescending(query);
        if (result2) {
          var totalRake = 0;
          var totalRakeAffiliate = 0;
          for (var i = 0; i < result2.length; i++) {
            totalRake = totalRake + result2[i].amount;
            totalRakeAffiliate =
              totalRakeAffiliate +
              (result2[i].debitToAffiliateamount || 0);
          }
          return {
            totalRake: totalRake,
            result: result1,
            totalRakeAffiliate: totalRakeAffiliate,
          };
        } else {
          throw new BadRequestException('Unable to get rake data result!');
        }
      } else {
        throw new BadRequestException('Unable to get rake data result!');
      }
    } else {
      query.debitToSubaffiliatename = params.parentUser;
      query.skip = params.skip;
      query.limit = params.limit;
      console.log("query: ", query);
      const result = await this.findRakeDataDescending(query);
      console.log("result=== ", result);
      if (result) {
        query.limit = 0;
        const result1 = await this.findRakeDataDescending(query);
        console.log("result1: ", result1);
        if (result1) {
          var totalRake = 0;
          var totalRakeSubAffiliate = 0;
          for (var i = 0; i < result1.length; i++) {
            totalRake = totalRake + result1[i].amount;
            totalRakeSubAffiliate =
              totalRakeSubAffiliate +
              (result1[i].debitToSubaffiliateamount || 0);
          }
          return {
            totalRake: totalRake,
            result: result,
            totalRakeSubAffiliate: totalRakeSubAffiliate,
          };
        } else {
          throw new BadRequestException('Unable to get rake data result!');
        }
      } else {
        throw new BadRequestException('Unable to get rake data result!');
      }
    }
  };
}
