import { HttpException, Inject, Injectable } from '@nestjs/common';
import { BonusDataService } from '../bonus-chips/services/bonus-data/bonus-data.service';
import { CashoutHistoryService } from '../direct-cashout/services/cashout-history/cashout-history.service';
import { PalyerBankDetailsService } from '../palyer-bank-details/palyer-bank-details.service';
import { TransactionHistoryReportService } from '../transaction-history/service/transaction-history-report.service';
import { UserService } from '../user/user.service';
import { TransactionHistoryOfPlayer } from './dto/transaction-history-of-player';
import _ from 'underscore';
import { getScratchCardHistory } from '@/v1/controller/scratchCard/scratchCardController';
import { scratchCardHistoryList } from '@/v1/model/queries/scratchCard';
import { LoyalityPlayerService } from '../loyality-player/loyality-player.service';
import { ScratchCardHistoryService } from './services/scratch-card-history/scratch-card-history.service';
import { GameActivityService } from './services/game-activity/game-activity.service';
import { TableService } from '../table/table.service';


@Injectable()
export class CustomerService {
  constructor(
    @Inject(UserService)
    protected readonly userService: UserService,
    @Inject(BonusDataService)
    protected readonly bonusDataService: BonusDataService,
    @Inject(PalyerBankDetailsService)
    protected readonly palyerBankDetailsService: PalyerBankDetailsService,
    @Inject(TransactionHistoryReportService)
    protected readonly transactionHistoryReportService: TransactionHistoryReportService,
    @Inject(CashoutHistoryService)
    protected readonly cashoutHistoryService: CashoutHistoryService,
    @Inject(LoyalityPlayerService)
    protected readonly loyalityPlayerService: LoyalityPlayerService,
    @Inject(ScratchCardHistoryService)
    protected readonly scratchCardHistoryService: ScratchCardHistoryService,
    @Inject(GameActivityService)
    protected readonly gameActivityService: GameActivityService,
    @Inject(TableService)
    protected readonly TableService: TableService,
  ) { }

  async findPlayerPersonalDetails(params) {
    console.log(
      'Inside findPlayerPersonalDetails customerReportManagement ---------' +
      JSON.stringify(params),
    );
    const userData = (await this.doesPlayerExist(params)).map(
      (x) => x.toObject(),
    );
    // await this.doesPlayerExist(params);
    await this.assignUnclaimedBonusToPlayers(userData);
    await this.getPlayerBankDetails(userData);
    this.assignLastLoginToPlayers(userData);

    return userData;
  }
  async doesPlayerExist(params) {
    console.log('Inside doesPlayerExist the params is ', params);
    let filter: any = {};
    if (params.userName) {
      filter.userName = eval('/^' + params.userName + '$/i');
    }
    if (params.email) {
      filter.emailId = params.email;
    }
    if (params.mobileNumber) {
      filter.mobileNumber = params.mobileNumber;
    }
    const result = await this.userService.findAll(filter);
    console.log('Successfully found doesPlayerExist', result);
    if (result.length == 0) {
      console.log('In result not found');
      return result;
    }
    params.userData = result;
    if (result.length > 0) {
      params.userName = result[0].userName;
    }
    return result;
  };


  async assignUnclaimedBonusToPlayers(userData: any) {
    const res = await this.bonusDataService.findAll({
      playerId: {
        $in: userData.map((x) => x.playerId),
      },
    });
    for (const player of userData) {
      let unclaimedBonusAmount = 0;
      let claimedBonusAmount = 0;
      const playerBonus = res.find((x) => x.playerId === player.playerId);
      if (playerBonus) {
        for (let j = 0; j < playerBonus.bonus.length; j++) {
          unclaimedBonusAmount += playerBonus.bonus[j].unClaimedBonus;
          claimedBonusAmount += playerBonus.bonus[j].claimedBonus;
        }
      }
      player.unclaimedBonusAmount = unclaimedBonusAmount;
      player.claimedBonusAmount = claimedBonusAmount;
    }
  }

  assignLastLoginToPlayers(userData) {
    let currentDate = Number(new Date());
    let temp1 = 0;
    let temp2 = 0;
    let hours = 0;
    for (let i = 0; i < userData.length; i++) {
      temp1 = ((currentDate - userData[i].lastLogin) / (1000 * 60 * 60 * 24));
      temp2 = Math.floor(temp1);
      hours = Math.floor((temp1 - temp2) * 24);
      if (temp2 < 0) {
        temp2 = 0;
        hours = 0;
      }
      userData[i].noOfDays = temp2;
      userData[i].hours = hours;
    }
  }

  async getPlayerBankDetails(userData) {

    try {
      if (userData && userData.length > 0) {
        const query: any = {};
        query.playerId = userData[0].playerId;
        const res = await this.palyerBankDetailsService.findOnePalyer(query);
        console.log(res);
        userData[0].bankDetails = res;
      }
    } catch (e) {
      throw new HttpException('Unable to find the bank details of this player', 404);
    }
  }

  async findDataFromTransactionHistory(params) {
    try {
      console.log('Inside findDataFromTransactionHistory the params is ', params);
      let filter: any = {};
      if (params.userName) {
        filter.loginId = params.userName;
        filter.loginType = /PLAYER/;
      }
      if (params.transactionId) {
        filter.referenceNumber = params.transactionId;
      }
      const skip = params.skip !== 0 ? params.skip : 0;
      const limit = params.limit !== 0 ? params.limit : 10;
      delete params.skip;
      delete params.limit;
      console.log("filter: ", filter);
      const result = await this.transactionHistoryReportService.findTransactionHistory(
        filter,
        {
          skip,
          limit,
          sortValue: '',
        },
      );
      console.log("result: ", result);
      params.transactionResult = result;
      return params;
    } catch (e) {
      console.log(e);
      throw new HttpException('No data found for the player', 404);
    }
  };
  async transactionHistoryCustomerSupport(params) {
    console.log("inside transactionHistoryCustomerSupport: ", params);
    // (await this.isPlayerValid(params)).map(
    //   (x) => x.toObject(),
    // );
    await this.isPLayerValidTCS(params)
    await this.findDataFromTransactionHistory(params);
    await this.findDataFromCashoutHistory(params);
    await this.findDataFromScratchCardHistory(params);
    return params;
  }

  async isPLayerValidTCS (params) {
    console.log('Inside isPLayerValidTCS the params is ', params);
    let filter: any = {};
    if (params.userName) {
      filter.userName = eval('/^' + params.userName + '$/i');
    }
    if (params.email) {
      filter.emailId = params.email;
    }
    if (params.mobileNumber) {
      filter.mobileNumber = params.mobileNumber;
    }
    if (Object.keys(filter).length > 0) {
      const result = await this.userService.findAll(filter);
      if (!!result && result.length > 0) {
        console.log('the result found in isPlayerValid is', result);
        if (!!result && result.length > 0) {
          params.userName = eval('/^' + result[0].userName + '$/i');
          params.playerId = result[0].playerId;
        }
        console.log('line 137 customerSupportManagement', JSON.stringify(result[0].userName));
        return params;
      } else {
        throw new HttpException('Please enter valid player details', 404);
      }
    } else {
      return params;
    }
  }

  async isPlayerValid(params) {
    console.log('Inside isPlayerValid the params is ', params);
    let filter: any = {};
    if (params.userName) {
      filter.userName = eval('/^' + params.userName + '$/i');
    }
    if (params.email) {
      filter.emailId = params.email;
    }
    if (params.mobileNumber) {
      filter.mobileNumber = params.mobileNumber;
    }
    const result = await this.userService.findAll(filter);
    if (!!result && result.length > 0) {
      console.log('the result found in isPlayerValid is', result);
      if (!!result && result.length > 0) {
        params.userName = eval('/^' + result[0].userName + '$/i');
        params.playerId = result[0].playerId;
      }
      console.log('line 137 customerSupportManagement', JSON.stringify(result[0].userName));
      return params;
    } else {
      throw new HttpException('Please enter valid player details', 404);
    }
  }

  async findDataFromCashoutHistory(params) {
    console.log('Inside findDataFromCashoutHistory the params is ', params);
    let filter: any = {};
    if (params.userName) {
      filter.userName = params.userName;
    }
    if (params.transactionId) {
      filter.transactionId = params.transactionId;
    }
    const skip = params.skip || 0;
    const limit = params.limit || 0;
    delete params.skip;
    delete params.limit;
    const result = await this.cashoutHistoryService.findAll(filter).skip(skip).limit(limit);
    if (!!result) {
      params.cashoutResult = result;
      params.finalResult = _.union(params.cashoutResult, params.transactionResult);
      console.log('Total data in union of cashout and transactionresult is', params.finalResult.length);
      return params;
    } else {
      console.log('No data found for such player');
      throw new HttpException('No Cashout Data found for such player', 404);
    }
  }
  async findDataFromScratchCardHistory(params) {
    try {
      console.log('findDataFromScratchCardHistory')
      let query: any = {};
      if (params.userName) {
        query['usedBy.userName'] = params.userName;
        query['usedBy.role.name'] = 'PLAYER';
      }
      if (params.transactionId) {
        query.generationId = params.transactionId;
      }
      const sortValue = params.sortValue ? params.sortValue : 'date';

      // const result: any = await scratchCardHistoryList(query);
      const result: any = await this.scratchCardHistoryService.findAll(query);
      if (result) {
        for (var i = 0; i < result.length; i++) {
          result[i].amount = result[i].denomination;
          result[i].amount = result[i].denomination;
          result[i].date = result[i].createdAt;
          delete result[i].createdAt;
          result[i].transferMode = 'SCRATCH CARD';
          result[i].referenceNumber = 'N/A';
        }
        console.log("err, result in findDataFromScratchCardHistory ", result);
        params.finalResult = _.union(params.finalResult, result);
        console.log(" final result data ", params.finalResult.length);
        return params;
      }
      else {
        console.log("Error in getting scratch card history");
        throw new HttpException('Error in getting scratch card history', 404);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async playerMagnetChipsData(params) {
    await this.isPlayerValid(params);
    await this.findPlayerMagnetChipsData(params);
    const monthlyMagnetChipsData = this.filterDataToMonthlyMagnetsData(params);
    return monthlyMagnetChipsData;
  }
  async findPlayerMagnetChipsData(params) {
    console.log('inside findPlayerMagnetChipsData ', params);
    let query: any = {};
    query.playerId = params.playerId;
    if (params.startDate && params.endDate) {
      query.date = { '$gte': params.startDate, '$lt': params.endDate };
    }
    const result = await this.loyalityPlayerService.findAll(query);
    if (result) {
      params.accumulationResult = result;
      return params;
    } else {
      console.log('No data found!');
      throw new HttpException('No data found for this player.', 404);
    }
  }
  filterDataToMonthlyMagnetsData (params) {
    console.log("inside filterDataToMonthlyMagnetsData", params);
    
    let monthlyMagnetChipsData = [];
    let index = 0;
    for (let j = params.startDate; j <= params.endDate; j = (new Date(j).setUTCMonth(new Date(j).getUTCMonth() + 1))) {
      let amount = 0;
      for (let i = 0; i < params.accumulationResult.length; i++) {
        if (params.accumulationResult[i].date >= j && params.accumulationResult[i].date < (new Date(j).setUTCMonth(new Date(j).getUTCMonth() + 1))) {
          amount += params.accumulationResult[i].earnedPoints;
        }
      }
      monthlyMagnetChipsData[index++] = { date: Number(new Date(j)), amount: amount };

    }

    return monthlyMagnetChipsData.reverse();
  }
  async countPlayerGameHistory(params) {
    if (!params.startDate && !params.endDate) {
      // params.endDate = Number(new Date());
      // params.startDate = params.endDate - 24 * 60 * 60 * 1000;
    }
    await this.findPlayerIdListGameHistory(params);
    return this.countPlayerGameOverData(params);
  }
  async findPlayerIdFromUserName(params) {
    console.log('Inside findPlayerIdFromUserName the params is ', params);
    let filter: any = {};
    if (params.userName) {
      filter.userName = eval('/^' + params.userName + '$/i');
    }

    const result = (await this.userService.findAll(filter)).map(item => item.toObject());
    if (!!result && result.length > 0) {
      console.log('the result found in findPlayerIdFromUserName is', result);
      if (!!result && result.length > 0) {
        params.userName = result[0].userName;
        params.playerId = result[0].playerId;
      }
      console.log('line 301 customerSupportManagement', JSON.stringify(params.playerId));
      return params;
    } else {
      console.log('No data found for such player');
      throw new HttpException('Please enter valid username', 404);
    }
  }
  countPlayerGameOverData(params) {
    let query = this.prepareQueryForFilters(params);
    return this.gameActivityService.countPlayerGameOverData(query);
  }
  prepareQueryForFilters(params) {
    console.log('inside prepareQueryForFilters ', params);
    let query: any = {};
    if (params.playerId) {
      query = {'subCategory': 'GAME OVER', 'rawResponse.params.table.onStartPlayers': params.playerId};
    } else {
      query = {'subCategory': 'GAME OVER'};
    }

    if (params.roundId) {
      query['rawResponse.params.table.roundNumber'] = params.roundId;
    }

    if (params.startDate && !params.endDate) {
      query.createdAt = { $gt: params.startDate};
    }

    if (!params.startDate && params.endDate) {
      query.createdAt = { $lte: params.endDate};
    }

    if (params.startDate && params.endDate) {
      query.createdAt = { $gt: params.startDate, $lte: params.endDate};
    }

    if (params.channelVariation) {
      query['rawResponse.params.table.channelVariation'] = params.channelVariation;
    }

    if (params.channelName) {
      query['rawResponse.params.table.channelName'] = params.channelName;
    }

    if (params.smallBlind) {
      query['rawResponse.params.table.smallBlind'] = params.smallBlind;
    }

    if (params.bigBlind) {
      query['rawResponse.params.table.bigBlind'] = params.bigBlind;
    }

    if (params.isRealMoney) {
      query['rawResponse.params.table.isRealMoney'] = JSON.parse(params.isRealMoney);
    }

    if (params.otherPlayer) {

    }
    console.log('\n\n\n\n\n', query, '\n\n\n\n\n');
    return query;
  }
  async listPlayerGameHistory(params) {
    console.log('Inside listPlayerGameHistory customerSupportManagement ', params);
    if (!params.startDate && !params.endDate) {
      // params.endDate = Number(new Date());
      // params.startDate = params.endDate - 24 * 60 * 60 * 1000;
    }

    await this.findPlayerIdListGameHistory(params);
    await this.findPlayerGameOverData(params);
    this.assignRemainingKeysToData(params);
    return params;
  }

  async findPlayerIdListGameHistory (params) {
    console.log('Inside findPlayerIdListGameHistory the params is ', params);
    let filter: any = {};
    if (params.userName) {
      filter.userName = eval('/^' + params.userName + '$/i');
    }
    
    if (Object.keys(filter).length === 0) {
      return params;
    }

    const result = (await this.userService.findAll(filter)).map(item => item.toObject());
    if (!!result && result.length > 0) {
      console.log('the result found in findPlayerIdFromUserName is', result);
      if (!!result && result.length > 0) {
        params.userName = result[0].userName;
        params.playerId = result[0].playerId;
      }
      console.log('line 301 customerSupportManagement', JSON.stringify(params.playerId));
      return params;
    } else {
      console.log('No data found for such player');
      throw new HttpException('Please enter valid username', 404);
    }
  }
  async findPlayerGameOverData (params) {
    console.log("inside findPlayerGameOverData", params);
    
    let query = this.prepareQueryForFilters(params);
    console.log("query========= ", query);
    const result = (await this.gameActivityService.findPlayerGameOverData(query)).map(item => item.toObject());
    console.log('findPlayerGameOverData', result)
    if (result.length > 0) {
      params.result = result;
      return params;
    } else {
      throw new HttpException('Unable to find player Game Data!', 404);
    }
  }
  convertCardsArrayToString(params) {
    console.log('params = ', params);
    let paramsString = '';
    if (params?.length > 0) {
      for (let i = 0; i < params.length; i++) {
        if (i == 5) {
          paramsString = paramsString + '\n\n';
        }
        paramsString = paramsString + params[i].name + '(' + params[i].type + ')';
        if (i < params.length - 1) {
          paramsString = paramsString + ',';
        }
      }
    }
    return paramsString;
  };

  assignRemainingKeysToData(params) {
    params.result.forEach(element => {
      let query: any = {};
      if (element?.rawResponse?.winners?.length > 0) {
        for (let i = 0; i < element.rawResponse.winners.length; i++) {
          element.rawResponse.winners[i].playerName = _.where(element?.rawResponse?.params?.table?.gamePlayers, { playerId: element.rawResponse.winners[i].playerId })[0].playerName;
        }
      }

      let playerData = _.where(element?.rawResponse?.params?.table?.gamePlayers, { playerName: params.userName })[0];
      element.playerCards = playerData?.cards;
      element.playerCardsString = this.convertCardsArrayToString(element?.playerCards);

      element.chipsAtBegin = playerData?.onGameStartBuyIn;
      element.seatIndex = playerData?.seatIndex;
      element.playerChips = _.where(element?.rawResponse?.params?.table?.contributors, { playerId: params.playerId });
      element.playerChips = (element.playerChips.length > 0) ? element.playerChips[0].amount : 0;
      element.totalPlayers = element?.rawResponse?.params?.table?.onStartPlayers.length;
      element.communityCards = _.union(element?.rawResponse?.params?.table?.boardCard[0], element?.rawResponse?.params?.table?.boardCard[1]);
      element.communityCards = _.without(element.communityCards, null);

      element.communityCardsString = this.convertCardsArrayToString(element.communityCards);

      element.winningAmount = 0;
      if (element?.rawResponse?.params?.table?.pot?.length > 0) {
        for (let i = 0; i < element?.rawResponse?.params?.table?.pot.length; i++) {
          element.winningAmount = element.winningAmount + element?.rawResponse?.params?.table?.pot[i].amount;
        }
      }



      let temp = 0;
      element.gameWinnersArray = [];
      for (let i = 0; i < element.rawResponse.winners.length; i++) {
        if (!element.rawResponse.winners[i].isRefund) {
          let result = this.convertCardsArrayToString(element.rawResponse.winners[i].set);
          if (result.length == 0) {
            result = 'Everyone has folded! @' + element.rawResponse.params.table.roundName;
          }

          element.gameWinnersArray[temp] = {};
          element.gameWinnersArray[temp].name = element.rawResponse.winners[i].playerName;
          element.gameWinnersArray[temp].gameWinnerString = result;
          element.gameWinnersArray[temp].handStrength = element.rawResponse.winners[i].type;
          if (element.rawResponse.winners[i].text) {
            element.gameWinnersArray[temp].handStrength = element.rawResponse.winners[i].text;
          }
          temp++;
        }
      }


      element.allGameWinners = '';
      element.winnersHandStrength = '';
      if (element?.gameWinnersArray?.length > 0) {
        for (let i = 0; i < element.gameWinnersArray.length; i++) {
          element.allGameWinners = element.allGameWinners + element.gameWinnersArray[i].name + ': [' + element.gameWinnersArray[i].gameWinnerString + ']';
          element.winnersHandStrength = element.winnersHandStrength + element.gameWinnersArray[i].name + ': [' + element.gameWinnersArray[i].handStrength + ']';
          if (i < element.gameWinnersArray.length - 1) {
            element.allGameWinners = element.allGameWinners + ',\n';
            element.winnersHandStrength = element.winnersHandStrength + ',\n';
          }
        }
      }


      if (element?.rawResponse?.winners?.length > 0) {
        for (let i = 0; i < element.rawResponse.winners.length; i++) {
          if (!element.rawResponse.winners[i].isRefund) {
            console.log('\n\n\n\n\n\n\nline 711 ', element.rawResponse.winners[i].playerName, '\n\n\n\n\n\n\n');
          }
        }
      }

      let totalPotAmount = 0, refundAmount = 0;

      if (element?.rawResponse?.params?.table?.pot?.length > 0) {
        for (let i = 0; i < element?.rawResponse?.params?.table?.pot.length; i++) {
          if (element?.rawResponse?.params?.table?.pot[i].contributors.length > 1) {
            totalPotAmount = totalPotAmount + element?.rawResponse?.params?.table?.pot[i].amount;
          } else if (element?.rawResponse?.params?.table?.pot[i].contributors.length == 1) {
            refundAmount = refundAmount + element?.rawResponse?.params?.table?.pot[i].amount;
          }
        }
      }


      // params.potAmount gives the amount on which rake was calculated
      if (element?.rawResponse?.params?.potAmount > 0 && element?.rawResponse?.params?.potAmount < totalPotAmount) {
        totalPotAmount = element.rawResponse.params.potAmount;
      }

      element.totalPotAmount = totalPotAmount;
      element.refundAmount = refundAmount;

      element.playerIp = playerData?.networkIp.substring(playerData?.networkIp.lastIndexOf(":") + 1);
      element.playerDeviceType = (playerData?.deviceType) ? playerData?.deviceType : '';
      element.cardsFoldStage = (playerData?.lastMove == 'FOLD') ? playerData?.lastRoundPlayed : 'N/A';
      element.leftTableStage = (playerData?.state == 'ONLEAVE') ? playerData?.lastRoundPlayed : 'N/A';
      element.rakeDeducted = element?.rawResponse?.params?.rakeDetails?.totalRake || 0;
      element.autoReBuy = playerData?.isAutoReBuy;
      element.chipsAdded = playerData?.chipsToBeAdded;
      element.runItTwice = playerData?.isRunItTwice;
      element.straddle = (element?.rawResponse?.params?.table?.straddleIndex > -1);
      element.autoMuck = playerData?.isMuckHand;
      return element;
    });
    return params;
  }

  getAllCashTablesProcess(params) {
    let query: any = {};
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
    return this.TableService.getAllCashTables(query);
  }
}
