import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerReportDto } from './dto/create-player-report.dto';
import { UpdatePlayerReportDto } from './dto/update-player-report.dto';
import * as shortid from 'shortid32';
import { UserService } from '../user/user.service';
import { FundrakeService } from '../finance/services/fundrake/fundrake.service';
import { DirectCashoutHistoryService } from '../direct-cashout/services/direct-cashout-history/direct-cashout-history.service';
import { AffiliateService } from '../user/services/affiliate/affiliate.service';
import _ from 'underscore';
import { CashoutHistoryService } from '../direct-cashout/services/cashout-history/cashout-history.service';
import { PlayerArchiveService } from '../user/services/player-archive/player-archive.service';
import { PlayerBlockedRecordService } from '../user/services/player-blocked-record/player-blocked-record.service';
import { BonusDataService } from '../bonus-chips/services/bonus-data/bonus-data.service';
import { PlayerParentHistoryService } from '../user/services/player-parent-history/player-parent-history.service';
import { parseStringToObjectId } from '@/shared/helpers/mongoose';
import { VipReleaseService } from '../user/services/vip-release/vip-release.service';
import async from "async";

shortid.characters('QWERTYUIOPASDFGHJKLZXCVBNM012345');
@Injectable()
export class PlayerReportService {
  megaPointsArray = [
    '',
    'Bronze',
    'Chrome',
    'Silver',
    'Gold',
    'Diamond',
    'Platinum',
  ];

  constructor(
    private readonly userService: UserService,
    private readonly fundrakeService: FundrakeService,
    private readonly directCashoutHistoryService: DirectCashoutHistoryService,
    private readonly affiliateService: AffiliateService,
    private readonly cashoutHistoryService: CashoutHistoryService,
    private readonly playerArchiveService: PlayerArchiveService,
    private readonly playerBlockedRecordService: PlayerBlockedRecordService,
    private readonly bonusDataService: BonusDataService,
    private readonly playerParentHistoryService: PlayerParentHistoryService,
    private readonly vipReleaseService: VipReleaseService,
  ) {}

  /**
   * This method is used to count the number of player when we are generating player report.
   *
   * @method countPlayerReport
   * @param  {Object}          req [a express request object]
   * @param  {Callback}        res [callback  as a response]
   * @return {Object}              [a JSON object containing success: Boolean, result: Object]
   */
  countPlayerReport(params) {
    console.log('Inside countPlayerReport ********', JSON.stringify(params));
    delete params.skip;
    delete params.limit;
    if (params.createdAt) {
      delete params.createdAt;
    }
    if (params.role) {
      delete params.role;
    }
    const query: any = {};
    if (params.isParentUserName) {
      query.isParentUserName = params.isParentUserName;
    }
    console.log('query in countPlayerReport', query);
    return this.userService.countPlayers(query);
  }

  /**
   * This method is used to find the players under the logged in user. It is used when we
   * list the player report.
   *
   * @method findPlayersFromUser
   * @param  {Object}            params [query object]
   * @param  {Function}          cb     [callback as a response containing succcess: Boolean,
   *                                    params: Object, result: Object]
   */
  async findPlayersFromUser(params) {
    console.log('Inside findPlayersFromUser the params is !!', params);
    let query: any = {};
    if (params.isParentUserName) {
      query = {
        $or: [
          { isParentUserName: params.isParentUserName },
          { isParent: params.isParentUserName },
        ],
      };
    }
    if (params.userName) {
      query.userName = eval('/' + params.userName + '/i');
    }

    if (params.city) {
      query['address.city'] = new RegExp(params.city, 'i');
    }
    // if (params.minHandsPlayed) {
    //   query['statistics.handsPlayedRM'] = { $get: params.minHandsPlayed }
    // }
    // if (params.maxHandsPlayed) {
    //   query['statistics.handsPlayedRM'] = { $lte: params.minHandsPlayed }
    // }
    // query.skip = 0;
    // query.limit = 0;

    const result = await this.userService.findAll(query).skip(0).limit(0);

    console.log('Successfully found findPlayersFromUser', result);
    if (result.length == 0) {
      console.log('In result not found');
      return result;
    }
    params.userName = result[0].userName;
    for (let i = 0; i < result.length; i++) {
      result[i].totalWinnings =
        result[i].realChips - result[i].chipsManagement.deposit;
      if (result[i].totalWinnings < 0) {
        result[i].totalWinnings = 0;
      }
      result[i].tournamentsPlayed = 0;
      result[i].averageTournamentWinnings = 0;
      result[i].numberOfDays = parseInt(
        ((Number(new Date()) - result[i].createdAt) / 86400000).toString(),
      ); // convert millisecond to number of days
    }
    params.result = result;
    return result;
  }

  // data win

  async dataWin (params) {
    let query: any = {};
    if (params.isParentUserName) {
      query = {
        $or: [
          { isParentUserName: params.isParentUserName },
          { isParent: params.isParentUserName },
        ],
      };
    }
    if (params.userName) {
      query.userName = eval('/' + params.userName + '/i');
    }

    // query.skip = 0;
    // query.limit = 0;
    let totalWinnings;
    let tournamentsPlayed;
    let averageTournamentWinnings;
    let numberOfDays;

    const result = await this.userService.findAll(query).skip(0).limit(0);

    console.log('Successfully found findPlayersFromUser', result);
    if (result.length == 0) {
      console.log('In result not found');
      return result;
    }
    params.userName = result[0].userName;
    for (let i = 0; i < result.length; i++) {
      totalWinnings =
        result[i].realChips - result[i].chipsManagement.deposit;
      if (totalWinnings < 0) {
        totalWinnings = 0;
      }
      tournamentsPlayed = 0;
      averageTournamentWinnings = 0;
      numberOfDays = parseInt(
        ((Number(new Date()) - result[i].createdAt) / 86400000).toString(),
      ); // convert millisecond to number of days
    }
    return { totalWinnings, tournamentsPlayed, averageTournamentWinnings, numberOfDays };
  }

  /**
   * This method is used to calculate the total rake generated by every player. Here we first
   * get the rake from the database and then sum up the rake for every player in the for loop and
   * then finally assign those rake along with the player data to show in the list.
   *
   * @method calculateTotalRake
   */
  async calculateTotalRake(params) {
    if (params?.result?.length > 0) {
      for (const player of params.result) {
        const query = {
          rakeByUsername: player.userName,
        };
        let totalRake = 0;
        const result: any[] = await this.fundrakeService.findAll(query);
        for (let i = 0; i < result.length; i++) {
          totalRake = totalRake + result[i].amount;
        }
        player.totalRake = totalRake;
        if (!!result.length && result.length > 0) {
          player.averageRakeGenerated = parseInt(
            (player.totalRake / result.length).toString(),
          );
        } else {
          player.averageRakeGenerated = 'N/A';
        }
      }
    }
  }

  // total rake
  async totalRake (params) {
    if (params?.result?.length > 0) {
      let totalRake = 0;
      let averageRakeGenerated;
      for (const player of params.result) {
        const query = {
          rakeByUsername: player.userName,
        };
        const result: any[] = await this.fundrakeService.findAll(query);
        for (let i = 0; i < result.length; i++) {
          totalRake = totalRake + result[i].amount;
        }
        player.totalRake = totalRake;
        if (!!result.length && result.length > 0) {
          averageRakeGenerated = parseInt(
            (player.totalRake / result.length).toString(),
          );
        } else {
          averageRakeGenerated = 'N/A';
        }
      }

      return { totalRake, averageRakeGenerated };
    }
  }

  // total rake hand
  async totalRakeHand (params) {
    let averageRakePerHand;
    for (let i = 0; i < params?.result?.length; i++) {
      if (
        params.result[i].totalRake &&
        params.result[i].statistics.handsPlayedRM
      ) {
        averageRakePerHand = parseInt(
          (
            params.result[i].totalRake /
            params.result[i].statistics.handsPlayedRM
          ).toString(),
        );
      } else {
        averageRakePerHand = 'NA';
      }
    }
    return { averageRakePerHand }
  }

  /**
   * This method calculate the total cashout of the player. Here also first we find the cashout of
   * every player and then sum up those cashout in the for loop and assign against each and every
   * player.
   *
   * @method calculateTotalCashout
   */
  async calculateTotalCashout(params) {
    console.log("calculateTotalCashout: ", params);
    if (params?.result?.length > 0) {
      for (const player of params.result) {
        let totalCashout = 0;
        const query = {
          userName: player.userName,
          status: 'Success',
        };
        if (player.parentType) {
          if (
            player.parentType == 'SUB-AGENT' ||
            player.parentType == 'AGENT'
          ) {
            query.status = eval('/' + 'Approved' + '/i');
            const result: any[] =
              await this.directCashoutHistoryService.findAll(query);
            for (var i = 0; i < result.length; i++) {
              if (!result[i].amount) {
                result[i].amount = 0;
              }
              if (!result[i].requestedAmount) {
                result[i].requestedAmount = 0;
              }
              totalCashout = parseInt(
                totalCashout + result[i].requestedAmount + result[i].amount,
              );
            }
            player.totalCashout = totalCashout;
          } else {
            const result: any[] =
              await this.directCashoutHistoryService.findAll(query);
            for (var i = 0; i < result.length; i++) {
              totalCashout = totalCashout + result[i].requestedAmount;
            }
            player.totalCashout = totalCashout;
          }
        } else {
          const result: any[] = await this.directCashoutHistoryService.findAll(
            query,
          );
          for (var i = 0; i < result.length; i++) {
            totalCashout = totalCashout + result[i].requestedAmount;
          }
          player.totalCashout = totalCashout;
        }
      }
    }
  }

  // data cashout

  async dataCashout (params) {
    if (params?.result?.length > 0) {
      let totalCashout = 0;
      for (const player of params.result) {
        const query = {
          userName: player.userName,
          status: 'Success',
        };
        if (player.parentType) {
          if (
            player.parentType == 'SUB-AGENT' ||
            player.parentType == 'AGENT'
          ) {
            query.status = eval('/' + 'Approved' + '/i');
            const result: any[] =
              await this.directCashoutHistoryService.findAll(query);
            for (var i = 0; i < result.length; i++) {
              if (!result[i].amount) {
                result[i].amount = 0;
              }
              if (!result[i].requestedAmount) {
                result[i].requestedAmount = 0;
              }
              totalCashout = parseInt(
                totalCashout + result[i].requestedAmount + result[i].amount,
              );
            }
            player.totalCashout = totalCashout;
          } else {
            const result: any[] =
              await this.directCashoutHistoryService.findAll(query);
            for (var i = 0; i < result.length; i++) {
              totalCashout = totalCashout + result[i].requestedAmount;
            }
            player.totalCashout = totalCashout;
          }
        } else {
          const result: any[] = await this.directCashoutHistoryService.findAll(
            query,
          );
          for (var i = 0; i < result.length; i++) {
            totalCashout = totalCashout + result[i].requestedAmount;
          }
          player.totalCashout = totalCashout;
        }
      }

      return { totalCashout };
    }
  }

  /**
   * This method calculate the average rake generated by each and every player. the average rake
   * generated per hand is division of the total rake generated by every player to the number of
   * hands played by that player. and finally we assign average rake with every player.
   *
   * @method calculateAverageRakePerHand
   * @param  {Object}                    params [query object]
   */
  calculateAverageRakePerHand(params) {
    for (let i = 0; i < params?.result?.length; i++) {
      if (
        params.result[i].totalRake &&
        params.result[i].statistics.handsPlayedRM
      ) {
        params.result[i].averageRakePerHand = parseInt(
          (
            params.result[i].totalRake /
            params.result[i].statistics.handsPlayedRM
          ).toString(),
        );
      } else {
        params.result[i].averageRakePerHand = 'NA';
      }
    }
  }

  /**
   * This method is used to calculate the percentage of hands won by every player. If any player has
   * played any no of hands and won then we find the percentage of hands won and assign those with
   * each and every player accordingly.
   *
   * @method calculatePercentHandsWon
   */
  calculatePercentHandsWon (params) {
    console.log("inside calculatePercentHandsWon", params);
    
    for (let i = 0; i < params?.result?.length; i++) {
      if (
        params.result[i].statistics.handsWonRM &&
        params.result[i].statistics.handsPlayedRM
      ) {
        params.result[i].percentageHandsWon = parseInt(
          (
            (params.result[i].statistics.handsWonRM /
              params.result[i].statistics.handsPlayedRM) *
            100
          ).toString(),  
        );
      } else {
        params.result[i].percentageHandsWon = 0;
      }
    }
  }

  /**
   * This method find the mega points circle of every player and assign against every player in the
   * player data.
   *
   * @method calculateMegaPointsCircle
   */
  calculateMegaPointsCircle(params) {
    for (let i = 0; i < params?.result?.length; i++) {
      if (params.result[i].statistics.megaPointLevel) {
        params.result[i].statistics.megaPointLevel =
          this.megaPointsArray[params.result[i].statistics.megaPointLevel];
      } else {
        params.result[i].statistics.megaPointLevel = 'Bronze';
      }
    }
    // cb(null, params);
  }

  /**
   * This method find the player data. This method is called when a affiliate log in and list the
   * player report. Here we find the players data which is under the logged in affiliates.
   *
   * @method findPlayersFromUserDateFilter
   */
  async findPlayersFromUserDateFilter (params) {
    console.log("findPlayersFromUserDateFilter: ", params);
    if (params.userName) {
      params.userName = eval('/' + params.userName + '/i');
    }
    const newQuery: any = {};
    if (params.userName) {
      newQuery.userName = params.userName;
    }
    if (params.isParentUserName) {
      newQuery.isParentUserName = params.isParentUserName;
    }
    const result = await (
      await this.userService
      .findAll(newQuery)
      .skip(params.skip || 0)
      .limit(params.limit || 0)
      ).map((item) => item.toObject());
      // console.log("result=== ", result);
    if (result.length == 0) {
      // params.result = [];
      // return [];
      throw new NotFoundException('No result found');
    }
    if (params.userName) {
      params.userName = result[0].userName;
    }
    for (let i = 0; i < result.length; i++) {
      result[i].totalWinnings =
        result[i].realChips - result[i].chipsManagement.deposit;
      if (result[i].totalWinnings < 0) {
        result[i].totalWinnings = 0;
      }
      result[i].tournamentsPlayed = 0;
      result[i].averageTournamentWinnings = 0;
      result[i].numberOfDays = parseInt(
        ((Number(new Date()) - result[i].createdAt) / 86400000).toString(),
      ); // convert millisecond to number of days
    }
    params.result = result;
  }

  /**
   * This method find all the sub-affiliate which is under the logged in affiliate. This method is used
   * in listing Player data.
   *
   * @method getAllSubAffiliates
   */
  async getAllSubAffiliates (params) {
    // console.log("inside getAllSubAffiliates: ", params);
    const query: any = {};
    if (params.role.level > 0) {
      return [];
    }
    if (params.userName && params.result && params.result.length > 0) {
      return [];
    }
    if (params.isParentUserName) {
      query.parentUser = params.isParentUserName;
    }

    // query.skip = params.skip || 0;
    // query.limit = params.limit || 0;
    // console.log('query ', query);
    // var projectionData = {}
    const result = await this.affiliateService
    .findAll(query)
    .skip(params.skip || 0)
    .limit(params.limit || 0);
    if (result && result.length >= 0) {
      params.affiliatesArray = result;
    }
    return [];
  }

  /**
   * This method finds all the Players under the subaffiliates. This method is used in listing Player
   * report.
   *
   * @method getPlayersFromSubAffiliate
   * @param  {Object}                   params [query object]
   * @param  {Function}                 cb     [callback as a response]
   * @return {Callback}                   [callback containing null, params: Object]
   */
  async getPlayersFromSubAffiliate (params) {
    // console.log("inside getPlayersFromSubAffiliate: ", params);
    if (params.role.level > 0) {
      return [];
    }
    if (params.userName && params.result && params.result.length > 0) {
      return [];
    }

    for (const affiliate of params.affiliatesArray) {
      const result = await this.getAllPlayers({
        isParentUserName: affiliate.userName,
        skip: 0,
        limit: 0,
      });
      if (result) {
        params.result = _.union(params.result, result);
      }
      break;
    }
  }

  /**
   * This method is used to get all player data under the affiliate/sub-affiliate whichever is
   * present in the query.
   *
   * @method getAllPlayers
   */
  async getAllPlayers(params) {
    console.log("getAllPlayers: ", params);
    const query: any = {};
    if (params.filter == 'players' && params.filterPlayer) {
      query.userName = params.filterPlayer;
    }
    
    if (params.isParentUserName) {
      query.isParentUserName = params.isParentUserName;
      // params.parentUser = params.isParentUserName;
    }
    delete params.skip;
    delete params.limit;
    console.log("params=== ", params);
    const result = await this.userService
    .findAll(params)
    .skip(params.skip || 0)
    .limit(params.limit || 0);
    console.log("result: ", result);
    if (result && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i].totalWinnings =
          result[i].realChips - result[i].chipsManagement.deposit;
        if (result[i].totalWinnings < 0) {
          result[i].totalWinnings = 0;
        }
        result[i].tournamentsPlayed = 0;
        result[i].averageTournamentWinnings = 0;
        result[i].numberOfDays = parseInt(
          ((Number(new Date()) - result[i].createdAt) / 86400000).toString(),
        ); // convert millisecond to number of days
      }
      params.playersArray = result;
      return result;
    } else {
      throw new BadRequestException('Unable to find player!');
      // cb({ success: false, info: 'Unable to find player!' });
    }
  }

  /**
   * This method is used to calculate the total rake generated by every player. Here we first
   * get the rake from the database and then sum up the rake for every player in the for loop and
   * then finally assign those rake along with the player data to show in the list.
   *
   * @method calculateTotalRakeDateFilter
   */
  async calculateTotalRakeDateFilter (params) {
    // console.log("inside calculateTotalRakeDateFilter: ", params);
    if (params.result.length > 0) {
      const len = params.result.length;
      for (let i = 0; i < len; i++) {
        const player = { ...params.result[i] };
        const query = {
          rakeByUsername: player.userName,
          addeddate: params.createdAt,
        };

        let totalRake = 0;
        const result: any[] = await this.fundrakeService.findAll(query);
        for (let j = 0; j < result.length; j++) {
          totalRake = totalRake + result[j].amount;
        }
        player.totalRake = totalRake;
        if (!!result.length && result.length > 0) {
          player.averageRakeGenerated = parseInt(
            (player.totalRake / result.length).toString(),
          );
        } else {
          player.averageRakeGenerated = 'N/A';
        }
        console.log('player', player);
        params.result[i] = player;
      }
    }
  }

  /**
   * This method calculate the total cashout of the player. Here also first we find the cashout of
   * every player and then sum up those cashout in the for loop and assign against each and every
   * player.
   *
   * @method calculateTotalCashoutDateFilter
   */
  async calculateTotalCashoutDateFilter (params) {
    // console.log("inside calculateTotalCashoutDateFilter: ", params);
    if (params.result.length > 0) {
      for (const player of params.result) {
        const query = {
          userName: player.userName,
          status: 'Success',
          createdAt: params.createdAt,
        };
        let totalCashout = 0;
        const result: any[] = await this.cashoutHistoryService.findAll(query);
        for (let i = 0; i < result.length; i++) {
          totalCashout = totalCashout + result[i].requestedAmount;
        }
        player.totalCashout = totalCashout;
      }
    }
  }

  /**
   * This method find the mega points circle of every player and assign against every player in the
   * player data.
   *
   * @method calculateChipsMegaCircle
   */
  async calculateChipsMegaCircle(params) {
    console.log("inside calculateChipsMegaCircleDate ", params);
    if (params.result && params.result.length > 0) {
      for (const player of params.result) {
        let date;
        let query: any = {};
        query.userName = player.userName;
        if (params.createdAt) {
          date = (params.createdAt.$lte) - 1000;
          query.timestamp = { $gte: date }
        }
        // const query = {
        //   userName: player.userName,
        //   timestamp: date,
        // };
        
        
        console.log("querycalculateChipsMegaCircle ", query);
        try {
          const result: any = await this.playerArchiveService.findOne(query);
          console.log("result====== ", result);
          // console.log("result============= ", result);
  
          if (result) {
            player.statistics = player.statistics || {};
            player.statistics.handsWon = result.handsWonRM || 0;
            player.statistics.handsPlayed = result.handsPlayedRM || 0;
            player.statistics.megaPoints = result.megaPoints || 0;
            player.statistics.megaPointLevel = this.megaPointsArray[result.megaPointLevel] || 'Bronze';
            player.realChips = result.realChips || 0;
          } else {
            // Nếu không tìm thấy kết quả, khởi tạo các thuộc tính với giá trị mặc định
            player.statistics = {
              handsWon: 0,
              handsPlayed: 0,
              megaPoints: 0,
              megaPointLevel: 'Bronze',
            };
            player.realChips = 0;
          }
        } catch (error) {
          console.error('Lỗi khi tìm kiếm dữ liệu:', error);
          // Xử lý lỗi tại đây nếu cần
        }
      }
    }
  }  

  /**
   * This method calculate the average rake generated by each and every player. the average rake
   * generated per hand is division of the total rake generated by every player to the number of
   * hands played by that player. and finally we assign average rake with every player.
   *
   * @method calculateAverageRakePerHandDateFilter
   */
  calculateAverageRakePerHandDateFilter (params) {
    // console.log("inside calculateAverageRakePerHandDateFilter: ", params);
    for (let i = 0; i < params.result.length; i++) {
      if (
        params.result[i].totalRake &&
        params.result[i].statistics.handsPlayedRM
      ) {
        params.result[i].averageRakePerHand = parseInt(
          (
            params.result[i].totalRake /
            params.result[i].statistics.handsPlayedRM
          ).toString(),
        );
      } else {
        params.result[i].averageRakePerHand = 'NA';
      }
    }
  }

  /**
   * This method is used to calculate the percentage of hands won by every player. If any player has
   * played any no of hands and won then we find the percentage of hands won and assign those with
   * each and every player accordingly.
   *
   * @method calculatePercentHandsWonDateFilter
   */
  calculatePercentHandsWonDateFilter (params) {
    // console.log("inside calculatePercentHandsWonDateFilter: ", params);
    for (let i = 0; i < params.result.length; i++) {
      if (
        params.result[i].statistics.handsWonRM &&
        params.result[i].statistics.handsPlayedRM
      ) {
        params.result[i].percentageHandsWon = parseInt(
          (
            (params.result[i].statistics.handsWonRM /
              params.result[i].statistics.handsPlayedRM) *
            100
          ).toString(),
        );
      } else {
        params.result[i].percentageHandsWon = 0;
      }
    }
  }

  /**
   * This method is used to calculate the percentage of hands won by every player. If any player has
   * played any no of hands and won then we find the percentage of hands won and assign those with
   * each and every player accordingly.
   *
   * @method calculatePercentHandsWonDateFilter
   */
  getAllPlayersWithAgent (params) {
    console.log("paramsgetAllPlayersWithAgent ", params);
    if (params.userId) {
      const resultData = params.result.filter((item) => item.isParentUserName === params.userId)
      params.result = resultData;
    }
  }

  /**
   * This method find the rake generated by a player in the given time period.
   *
   * @method findPlayersRakeChart
   */
  findPlayersRakeChart(params) {
    console.log('Inside findPlayersRakeChart the params is !!', params);
    const selectedDate = params.addeddate; // contains 1 Aug 2017 if any date from aug month is selected
    const nextMonthDate = new Date(params.addeddate).setMonth(
      new Date(params.addeddate).getMonth() + 1,
    );
    console.log('the next month date is ', nextMonthDate);
    const query: any = {};
    query.addeddate = { $gte: selectedDate, $lte: nextMonthDate };
    query.rakeByUsername = params.userName;
    params.startDate = selectedDate;
    params.endDate = nextMonthDate - 1000;
    return this.fundrakeService.findAll(query);
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
    console.log(
      'inside createRakeDataToDailyRakeData ',
      params.rakeData.length,
    );
    const dailyRakeData = [];
    let i = 0;
    if (params.rakeData.length > 0) {
      for (
        let tempCheck = params.startDate;
        tempCheck <= params.endDate;
        tempCheck += 24 * 60 * 60 * 1000
      ) {
        let dailyRake = 0;
        for (const tempObj in params.rakeData) {
          if (
            params.rakeData[tempObj].addeddate >= tempCheck &&
            params.rakeData[tempObj].addeddate < tempCheck + 24 * 60 * 60 * 1000
          ) {
            dailyRake = dailyRake + params.rakeData[tempObj].amount;
          }
        }
        console.log('i=======================', i);
        dailyRakeData[i++] = {
          userName: params.userName,
          date: tempCheck,
          dailyRake: parseFloat(dailyRake.toFixed(2)),
        };
      }

      dailyRakeData.sort(function (a, b) {
        return parseFloat(b.date) - parseFloat(a.date);
      });
    }
    console.log('result ==== ', dailyRakeData);
    return dailyRakeData;
    // cb(null, dailyRakeData);
  }

  /**
   * This method is called when we generate the player game played chart. Here first we find the
   * game played data on the daily basis and then generate the chart according to the data obitained.
   *
   * @method findPlayersGameChart
   */
  async findPlayersGameChart(params) {
    console.log('Inside findPlayersGameChart the params is !!', params);
    const selectedDate = params.timestamp; // contains 1 Aug 2017 if any date from aug month is selected
    const nextMonthDate = new Date(params.timestamp).setMonth(
      new Date(params.timestamp).getMonth() + 1,
    );
    console.log('the selected date in findPlayersGameChart is', selectedDate);
    console.log(
      'the next month date in findPlayersGameChart is ',
      nextMonthDate,
    );
    const lastDayMillisecond = nextMonthDate - 1000;
    const lastDayDate = new Date(lastDayMillisecond);
    const graphLength = lastDayDate.getDate();
    console.log('the graphLength is', graphLength);
    const query: any = {};
    query.timestamp = {
      $gte: selectedDate - 24 * 60 * 60 * 1000,
      $lt: nextMonthDate,
    };
    query.userName = params.userName;
    params.startDate = selectedDate;
    params.endDate = nextMonthDate;
    const resultArray = [];
    console.log('line 596 ==== ', query);

    const result: any[] = await this.playerArchiveService
      .findAll(query)
      .then((items) => items.map((item) => item.toObject()));

    console.log(
      'the value of result in findPlayersGameChart is -------',
      result,
    );
    if (result && result.length > 0) {
      const tempStartDate = result[0].timestamp;
      const tempEndDate = result[result.length - 1].timestamp;
      const newResult = [];
      let j = 0;
      for (let i = selectedDate; i < nextMonthDate; i += 24 * 60 * 60 * 1000) {
        if (i > Number(new Date())) {
          break;
        }
        var previousDayObject = _.where(result, { timestamp: i - 1000 })[0];
        console.log("previousDayObject: ", previousDayObject);
        
        const currentDayObject = _.where(result, {
          timestamp: i + 86400000 - 1000,
        })[0];
        let handsPlayedPreviousDay = 0,
          handsPlayedCurrentDay = 0;
        if (!previousDayObject) {
          for (let k = 1; k <= 10; k++) {
            var previousDayObject = _.where(result, {
              timestamp: i - k * 86400000 - 1000,
            })[0];
            if (previousDayObject) {
              break;
            }
          }
        }
        if (previousDayObject) {
          handsPlayedPreviousDay = previousDayObject.handsPlayed;
        }
        if (currentDayObject) {
          handsPlayedCurrentDay = currentDayObject.handsPlayed;
        }
        let handsPlayedDifference =
        handsPlayedCurrentDay - handsPlayedPreviousDay;
        if (handsPlayedDifference < 0) {
          handsPlayedDifference = 0;
        }
        const tempOffset = i + 86400000 - 1000;
        newResult[j++] = {
          date: tempOffset,
          handsPlayed: handsPlayedDifference,
        };
      }
      console.log("newResult: ", newResult);
      return newResult;
    }
  }

  /**
   * This method checks that if the player exists with the specified username.
   *
   * @method checkPlayerExists
   * @param  {Object}          params [query object]
   * @param  {Function}        cb     [callback as a response containing success: Boolean,
   *                                  info: String]
   */
  async checkPlayerExists(params) {
    console.log('inside checkPlayerExists ', params);
    const result: any = await this.userService.findOne({
      userName: eval('/^' + params.userName + '$/i'),
    });
    if (result) {
      params.userName = result.userName;
      if (params.loginId) {
        if (result.isParentUserName == params.loginId) {
          return true;
        } else {
          const result2: any = this.affiliateService.findOne({
            userName: result.isParentUserName,
          });
          if (result2 && result2.parentUser == params.loginId) {
            return true;
          } else {
            throw new BadRequestException(
              'Player not found for logged in affiliate!',
            );
          }
        }
      }
    } else {
      throw new BadRequestException('Player data not found!');
    }
  }

  /**
   * This method find the rake generated by a player for the current month.
   *
   * @method findRakeForCurrentMonth
   */
  async findRakeForCurrentMonth(params) {
    const result = await this.findPlayersRakeChart(params);
    if (result) {
      params.rakeData = result;
    }
  }

  /**
   * This method find the rake data for current month. Inside this a function is called which
   * converts the rake data of the current month on the daily rake data.
   *
   * @method filterRakeDataForCurrentMonth
   * @param  {Object}                      params [query object]
   * @param  {Function}                    cb     [callback as a response containing success: Boolean,
   *                                              result: Object]
   */
  async filterRakeDataForCurrentMonth(params) {
    const result = await this.createRakeDataToDailyRakeData(params);
    if (result) {
      params.currentMonthRakeData = result;
    }
  }

  /**
   * This method find the rake data for previous month.
   *
   * @method findRakeForPrevMonth
   */
  async findRakeForPrevMonth(params) {
    params.addeddate = params.addeddate - 86400000 * 31;
    const result = await this.findPlayersRakeChart(params);
    if (result) {
      params.rakeData = result;
    }
  }

  /**
   * This method find the rake data for previous month. Inside this a function is called which
   * converts the rake data of the previous month on the daily rake data.
   *
   * @method filterRakeDataForPrevMonth
   */
  async filterRakeDataForPrevMonth(params) {
    const result = await this.createRakeDataToDailyRakeData(params);
    if (result) {
      params.previousMonthRakeData = result;
    }
  }
  // games played by a player in currentMonth
  async findGamesPlayedForCurrentMonth(params) {
    const result = await this.findPlayersGameChart(params);
    // if (result) {
    params.gameDataCurrentMonth = result || [];
    // }
    // else {
    //   cb({ success: false, result: err });
    // }
  }

  // games played by a player in prevMonth
  async findGamesPlayedForPreviousMonth(params) {
    const tempDate = new Date(params.timestamp);
    tempDate.setMonth(tempDate.getMonth() - 1);
    params.timestamp = Number(tempDate);
    const result = await this.findPlayersGameChart(params);
    if (result) {
      params.gameDataPreviousMonth = result;
    }
    // else {
    //   cb({ success: false, result: err });
    // }
  }

  /**
   * This method is used to list the player report in Dashboard.
   *
   * @method listPlayers
   * @param  {Object}          req [a express request object]
   * @param  {Callback}        res [callback  as a response]
   * @return {Object}        [a JSON object containing success: Boolean, result: Object]
   */
  async listPlayers(params) {
    console.log(
      'Inside listPlayers playerReportManagement ---------' +
        JSON.stringify(params),
    );
    await this.findPlayersFromUser(params);
    await this.calculateTotalRake(params);
    await this.calculateTotalCashout(params);
    await this.calculateAverageRakePerHand(params);
    await this.calculatePercentHandsWon(params);
    await this.calculateMegaPointsCircle(params);
    const totalRake = await this.totalRake(params);
    const totalRakeHand = await this.totalRakeHand(params);
    const dataWin: any = await this.dataWin(params);
    const dataCashout = await this.dataCashout(params);
    console.log("params.result: ", params.result);
    return {
      data: params.result,
      totalRake: totalRake?.totalRake || 0,
      averageRakeGenerated: totalRake?.averageRakeGenerated || 0,
      averageRakePerHand: totalRakeHand?.averageRakePerHand || 0,
      numberOfDays: dataWin?.numberOfDays || 0,
      averageTournamentWinnings: dataWin?.averageTournamentWinnings || 0,
      tournamentsPlayed: dataWin?.tournamentsPlayed || 0,
      totalWinnings: dataWin?.totalWinnings || 0,
      totalCashout: dataCashout?.totalCashout || 0
    }
    // async.waterfall([
    //   async.apply(findPlayersFromUser, req.body),
    //   calculateTotalRake,
    //   calculateTotalCashout,
    //   calculateAverageRakePerHand,
    //   calculatePercentHandsWon,
    //   calculateMegaPointsCircle
    // ], function (err, result) {
    //   console.log("for checking default data---", err, result);
    //   if (err) {
    //     return res.json({ success: false, result: err });
    //   } else {
    //     result.success = true;

    //     return res.json({ success: true, result: result.result });
    //   }
    // });
  }

  /**
   * This method is used to list the player report in Dashboard if date filter is present
   * .
   * @method listPlayersIfDateFilter
   * @param  {Object}          req [a express request object]
   * @param  {Callback}        res [callback  as a response]
   * @return {Object}        [a JSON object containing success: Boolean, result: Object]
   */
  async listPlayersIfDateFilter(params) {
    console.log(
      'Inside listPlayersIfDateFilter playerReportManagement ---------' +
        JSON.stringify(params),
    );
    let query = params;
    console.log("query: ", query);
    
    await this.findPlayersFromUserDateFilter(params);
    await this.getAllSubAffiliates(params);
    await this.getPlayersFromSubAffiliate(params);
    await this.calculateTotalRakeDateFilter(params);
    await this.calculateTotalCashoutDateFilter(params);
    await this.calculateChipsMegaCircle(params);
    await this.calculateAverageRakePerHandDateFilter(params);
    await this.calculatePercentHandsWonDateFilter(params);
    await this.getAllPlayersWithAgent(params);
    const result = params;
    // console.log("resultlistPlayersIfDateFilter ", result.result);
    if (query.containsFilters) {
      if (query.isParentUserName) {
        result.result = _.filter(result.result, function (element) {
          return element.isParentUserName
            .toUpperCase()
            .includes(params.userId.toUpperCase());
        });
      }
      if (query.city) {
        result.result = _.filter(result.result, function (element) {
          return (
            element.address.city.toUpperCase() === query.city.toUpperCase()
          );
        });
      }
      if (query.minRake) {
        result.result = _.filter(result.result, function (element) {
          return element.totalRake >= JSON.parse(query.minRake);
        });
      }
      if (query.maxRake) {
        result.result = _.filter(result.result, function (element) {
          return element.totalRake <= JSON.parse(query.maxRake);
        });
      }
      if (query.minHandsPlayed) {
        result.result = _.filter(result.result, function (element) {
          return element.statistics.handsPlayedRM >= JSON.parse(query.minHandsPlayed);
        });
      }
      if (query.maxHandsPlayed) {
        result.result = _.filter(result.result, function (element) {
          return element.statistics.handsPlayedRM <= JSON.parse(query.maxHandsPlayed);
        });
      }
      if (query.minPercentHandsWon) {
        result.result = _.filter(result.result, function (element) {
          return element.percentageHandsWon >= JSON.parse(query.minPercentHandsWon);
        });
      }
      if (query.maxPercentHandsWon) {
        result.result = _.filter(result.result, function (element) {
          return element.percentageHandsWon <= JSON.parse(query.maxPercentHandsWon);
        });
      }
      if (query.minWinnings) {
        result.result = _.filter(result.result, function (element) {
          return element.totalWinnings >= JSON.parse(query.minWinnings);
        });
      }
      if (query.maxWinnings) {
        result.result = _.filter(result.result, function (element) {
          return element.totalWinnings <= JSON.parse(query.maxWinnings);
        });
      }
    }
    return result.result;

    // async.waterfall([
    //   async.apply(findPlayersFromUserDateFilter, req.body),
    //   getAllSubAffiliates,
    //   getPlayersFromSubAffiliate,
    //   calculateTotalRakeDateFilter,
    //   calculateTotalCashoutDateFilter,
    //   calculateChipsMegaCircle,
    //   calculateAverageRakePerHandDateFilter,
    //   calculatePercentHandsWonDateFilter
    // ], function (err, result) {
    //   if (err) {
    //     return res.json({ success: false, result: err });
    //   } else {
    //     result.success = true;
    //     if (params.containsFilters) {
    //       if (params.userId) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.isParentUserName.toUpperCase().includes(params.userId.toUpperCase());
    //         });
    //       }
    //       if (params.city) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.address.city.toUpperCase() === params.city.toUpperCase();
    //         });
    //       }
    //       if (params.minRake) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.totalRake >= params.minRake;
    //         });
    //       }
    //       if (params.maxRake) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.totalRake <= params.maxRake;
    //         });
    //       }
    //       if (params.minHandsPlayed) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.statistics.handsPlayedRM >= params.minHandsPlayed;
    //         });
    //       }
    //       if (params.maxHandsPlayed) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.statistics.handsPlayedRM <= params.maxHandsPlayed;
    //         });
    //       }
    //       if (params.minPercentHandsWon) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.percentageHandsWon >= params.minPercentHandsWon;
    //         });
    //       }
    //       if (params.maxPercentHandsWon) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.percentageHandsWon <= params.maxPercentHandsWon;
    //         });
    //       }
    //       if (params.minWinnings) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.totalWinnings >= params.minWinnings;
    //         });
    //       }
    //       if (params.maxWinnings) {
    //         result.result = _.filter(result.result, function (element) {
    //           return element.totalWinnings <= params.maxWinnings;
    //         });
    //       }
    //     }
    //     return res.json({ success: true, result: result.result });
    //   }
    // });
  }

  /**
  This method find the player data chart for every player.
  
   * @method findPlayerDataChart
   * @param  {Object}            params [query object]
   * @param  {Callback}        res [callback  as a response]
   * @return {Object}                   [a JSON object containing success: Boolean, result: Object/String]
   */
  async findPlayerDataChart(params) {
    console.log(
      'Inside findPlayerDataChart playerReportManagement ---------' +
        JSON.stringify(params.body),
    );
    await this.checkPlayerExists(params);
    await this.findRakeForCurrentMonth(params);
    await this.filterRakeDataForCurrentMonth(params);
    await this.findRakeForPrevMonth(params);
    await this.filterRakeDataForPrevMonth(params);
    const result = params;
    if (result.currentMonthRakeData.length > 0) {
      // result.success = true;
      console.log('the final result is-------- ', JSON.stringify(result));
      return result.currentMonthRakeData;
    }
    throw new HttpException('No data found', 404);

    // async.waterfall([
    //   async.apply(checkPlayerExists, params.body),
    //   findRakeForCurrentMonth,
    //   filterRakeDataForCurrentMonth,
    //   findRakeForPrevMonth,
    //   filterRakeDataForPrevMonth

    // ], function (err, result) {
    //   if (err) {
    //     return res.json({ success: false, result: err.info });
    //   }
    //   else if (result.currentMonthRakeData.length > 0) {
    //     result.success = true;
    //     console.log('the final result is-------- ', JSON.stringify(result));
    //     return res.json({ success: true, result: result });
    //   }
    //   else {
    //     return res.json({ success: false, result: "No data found" });
    //   }
    // });
  }

  // find daily handsplayed by player
  async findPlayerDataChartGamesPlayed(params) {
    console.log(
      'Inside findPlayerDataChartGamesPlayed playerReportManagement ---------' +
        JSON.stringify(params.body),
    );
    await this.checkPlayerExists(params);
    await this.findGamesPlayedForCurrentMonth(params);
    if (params.gameDataCurrentMonth.length > 0) {
      // result.success = true;
      // console.log('the final result is-------- ', JSON.stringify(params.gameDataCurrentMonth));
      return params;
    } else {
      throw new HttpException('No data found', 400);
      // return res.json({ success: false, result: "No data found" });
    }
  }

  /**
   * This method counts the number of banned player.
   *
   * @method countPlayerBannedData
   * @param  {Object}          req [a express request object]
   * @param  {Callback}        res [callback  as a response]
   * @return {Object}                   [a JSON object containing success: Boolean, result: Object,
   *                                        info: String]
   */
  countPlayerBannedData(params) {
    console.log('inside countPlayerBannedData line929', params);
    const query: any = {};
    if (params.startDate && params.endDate) {
      query.createdAt = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.userName) {
      query.userName = eval('/' + params.userName + '/i');
    }
    if (params.parent) {
      query.parent = eval('/' + params.parent + '/i');
    }
    if (params.reasonForBan) {
      query.reasonForBan = params.reasonForBan;
    }
    if (!params.minRake && params.maxRake) {
      query.totalRake = { $lte: params.maxRake };
    }
    if (params.minRake && !params.maxRake) {
      query.totalRake = { $gte: params.minRake };
    }
    if (params.minRake && params.maxRake) {
      query.totalRake = { $gte: params.minRake, $lte: params.maxRake };
    }
    if (params.megaCircle) {
      query.megaCircle = parseInt(params.megaCircle);
    }
    if (!params.startDateJoin && params.endDateJoin) {
      query.playerJoinedAt = { $lte: params.endDateJoin };
    }
    if (params.startDateJoin && !params.endDateJoin) {
      query.playerJoinedAt = { $gte: params.startDateJoin };
    }
    if (params.startDateJoin && params.endDateJoin) {
      query.playerJoinedAt = {
        $gte: params.startDateJoin,
        $lte: params.endDateJoin,
      };
    }
    console.log('query==========', query);

    return this.playerBlockedRecordService.count(query);
    // logdb.countPlayerBannedData(query, function (err, result) {
    //   if (!err && result) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: 'Unable to find players!' });
    //   }
    // });
  }

  /**
   * This method is used when we list the banned players.
   *
   * @method listPlayerBannedData
   * @param  {Object}          req [a express request object]
   * @param  {Callback}        res [callback  as a response]
   * @return {Object}              [a JSON object containing success: Boolean, result: Object,
   *                                  info: String]
   */
  async listPlayerBannedData(params) {
    console.log('line 951   ', params);
    const query: any = {};
    if (params.startDate && params.endDate) {
      query.createdAt = { $gte: new Date(params.startDate), $lt: new Date(params.endDate) };
    }
    if (params.userName) {
      query.userName = eval('/' + params.userName + '/i');
    }
    if (params.parent) {
      query.parent = eval('/' + params.parent + '/i');
    }
    // if (params.skip || params.skip == 0) {
    //   query.skip = params.skip;
    // }
    // if (params.limit || params.limit == 0) {
    //   query.limit = params.limit;
    // }
    if (params.reasonForBan) {
      query.reasonForBan = params.reasonForBan;
    }
    if (!params.minRake && params.maxRake) {
      query.totalRake = { $lte: params.maxRake };
    }
    if (params.minRake && !params.maxRake) {
      query.totalRake = { $gte: params.minRake };
    }
    if (params.minRake && params.maxRake) {
      query.totalRake = { $gte: params.minRake, $lte: params.maxRake };
    }
    if (params.megaCircle) {
      query.megaCircle = parseInt(params.megaCircle);
    }
    if (!params.startDateJoin && params.endDateJoin) {
      query.playerJoinedAt = { $lte: new Date(params.endDateJoin).getTime() };
    }
    if (params.startDateJoin && !params.endDateJoin) {
      query.playerJoinedAt = { $gte: new Date(params.startDateJoin).getTime() };
    }
    if (params.startDateJoin && params.endDateJoin) {
      var start = new Date(params.startDateJoin).getTime();
      var end = new Date(params.endDateJoin).getTime();
      query.playerJoinedAt = {
        $gte: start,
        $lte: end,
      };
    }
    console.log("query: ", query);
    // console.log('query', query)
    return await this.playerBlockedRecordService
      .findAll(query)
      .skip(params.skip || 0)
      .limit(params.limit || 0);
    // logdb.listPlayerBannedData(query, function (err, result) {
    //   if (!err && result) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: 'Unable to fetch data' });
    //   }
    // });
  }

  countDataInPlayerBonusReport(params) {
    console.log('inside countDataInPlayerBonusReport line929', params);
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/' + params.userName + '/i');
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate };
    }
    if (params.endDate && !params.startDate) {
      query.date = { $lt: params.endDate };
    }
    if (params.endDate && params.startDate) {
      query.date = { $gte: params.startDate, $lt: params.endDate };
    }

    console.log('query==========', query);
    return this.vipReleaseService.count(query);
    // db.countPlayerBonusHistoryRecord(query, function (err, result) {
    //   console.log("err, res--", err, result);
    //   if (!err && result) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: 'Unable to count player Bonus History Record' });
    //   }
    // });
  }

  listDataInPlayerBonusReport(params) {
    console.log('inside listDataInPlayerBonusReport line929', params);
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/' + params.userName + '/i');
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate };
    }
    if (params.endDate && !params.startDate) {
      query.date = { $lt: params.endDate };
    }
    if (params.endDate && params.startDate) {
      query.date = { $gte: params.startDate, $lt: params.endDate };
    }
    // if (params.skip) {
    //   query.skip = params.skip;
    // }
    // if (params.limit) {
    //   query.limit = params.limit;
    // }
    console.log('query==========', query);
    return this.vipReleaseService
      .findAll(query)
      .skip(params.skip || 0)
      .limit(params.limit || 0)
      .sort({ date: -1 });
    // db.listPlayerBonusHistoryRecord(query, function (err, result) {
    //   console.log("err, res--", err, result);
    //   if (!err && result) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: 'Unable to count player Bonus History Record' });
    //   }
    // });
  }

  async listDataInPlayerChipsReport(params) {
    await this.checkUserExists(params);
    await this.getPlayerBonusInfo(params);
    return params;
  }

  async checkUserExists(params) {
    console.log('inside checkUserExists ', params);
    const result = (
      await this.userService.findOne(
        {
          userName: eval('/^' + params.userName + '$/i'),
        },
        {
          playerId: 1,
          userName: 1,
          isParentUserName: 1,
          realChips: 1,
          instantBonusAmount: 1,
          claimedInstantBonus: 1,
        },
      )
    )?.toObject();
    if (result) {
      params.playerData = result;
      params.playerData.totalAvailableChips =
        result.realChips + result.instantBonusAmount;
      return result;
    } else {
      throw new HttpException('Player not found!', 404);
    }
  }

  async getPlayerBonusInfo(params) {
    console.log('inside getPlayerBonusInfo ', params);
    const query: any = {};
    query.playerId = params.playerData.playerId;
    const result = await this.bonusDataService.findOne(query);
    if (result) {
      params.playerData.claimedLockedBonus = 0;
      params.playerData.lockedBonus = 0;
      for (let i = 0; i < result.bonus.length; i++) {
        params.playerData.claimedLockedBonus =
          params.playerData.claimedLockedBonus + result.bonus[i].claimedBonus;
        params.playerData.lockedBonus =
          params.playerData.lockedBonus + result.bonus[i].unClaimedBonus;
      }
      return result;
    } else {
      throw new NotFoundException('Player Bonus Info Not Found !');
    }
  }

  countDataInPlayerInfoReport(params) {
    console.log('inside countDataInPlayerInfoReport line929', params);
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    if (params.email) {
      query.emailId = eval('/' + params.email + '/i');
    }
    if (params.mobile) {
      query.mobileNumber = params.mobile;
    }
    if (params.status) {
      query.status = params.status;
    }
    console.log('query==========', query);
    return this.userService.count(query);
    // db.countPlayerInfoRecord(query, function (err, result) {
    //   console.log("err, res--", err, result);
    //   if (!err && result) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: 'Unable to count player info Record' });
    //   }
    // });
  }

  /**
   * method used to count player parent history records
   * @method countDataInPlayerParentHistory
   */
  countDataInPlayerParentHistory(params) {
    console.log('inside countDataInPlayerParentHistory line929', params);
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    console.log('query==========', query);
    return this.playerParentHistoryService.count(query);
    // admindb.countDataInPlayerParentHistory(query, function (err, result) {
    //   console.log("err, res--", err, result);
    //   if (!err && result) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: 'Unable to count player parent history Records' });
    //   }
    // });
  }

  /**
   * method used to list data of player parent details
   * @method listDataInPlayerParentHistory
   */
  listDataInPlayerParentHistory(params) {
    console.log('inside listDataInPlayerParentHistory line929', params);
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    // query.skip = params.skip || 0;
    // query.limit = params.limit || 0;
    console.log('query==========', query);
    return this.playerParentHistoryService
      .findAll(query)
      .skip(params.skip)
      .limit(params.limit)
      .sort({ updatedAt: -1 });
    // admindb.listDataInPlayerParentHistory(query, function (err, result) {
    //   console.log("err, res--", err, result);
    //   if (!err && result) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: 'Unable to list player parent history Records' });
    //   }
    // });
  }

  async listDataInPlayerInfoReport(params) {
    console.log('inside listDataInPlayerInfoReport line929', params);
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    if (params.email) {
      query.emailId = eval('/' + params.email + '/i');
    }
    if (params.mobile) {
      query.mobileNumber = params.mobile;
    }
    if (params.status) {
      query.status = params.status;
    }

    console.log('query==========', query);



      if (params.fromCustomerSupport) {
        const customerResult = await (
          await this.userService
            .findAll(query)
            .skip(params.skip || 0)
            .limit(params.limit || 0)
        ).map((item) => item.toObject());
        if (customerResult) {
          return this.assignLastLoginToPlayers(customerResult);
        } else {
          throw new NotFoundException('Unable to list player info report records');
        }
      } else {
        const result = await this.userService
        .findAll(query, null, {
          userName: 1,
          firstName: 1,
          lastName: 1,
          emailId: 1,
          mobileNumber: 1,
          status: 1,
          lastLogin: 1,
        })
        .skip(params.skip || 0)
        .limit(params.limit || 0);
        if (result) {
          return result;
        } else {
          throw new NotFoundException('Unable to list player info report records');
        }
      }
  }

  /**
   * method to assign last login to each player
   * @method assignLastLoginToPlayers
   */
  assignLastLoginToPlayers(params) {
    const currentDate = Number(new Date());
    let temp1 = 0;
    let temp2 = 0;
    let hours = 0;
    for (let i = 0; i < params.length; i++) {
      temp1 = (currentDate - params[i].lastLogin) / (1000 * 60 * 60 * 24);
      temp2 = Math.floor(temp1);
      hours = Math.floor((temp1 - temp2) * 24);
      if (temp2 < 0) {
        temp2 = 0;
        hours = 0;
      }
      params[i].noOfDays = temp2;
      params[i].hours = hours;
    }
    return params;
  }
}
