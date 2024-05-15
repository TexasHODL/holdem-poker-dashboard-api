import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import _ from 'underscore';
import randomize from 'randomatic';
import { UserService } from '@/modules/user/user.service';
import { PlayerPassbookService } from '@/modules/player-passbook/player-passbook.service';
import { ScheduledExpiryService } from '../scheduled-expiry/scheduled-expiry.service';
import { BalanceSheetService } from '@/modules/finance/services/balance-sheet/balance-sheet.service';
import { SocketClientService } from '@/shared/services/socket-client/socket-client.service';
import { SmsService } from '@/shared/services/sms/sms.service';
import { BonusDataService } from '../bonus-data/bonus-data.service';
import { LoyaltyPointService } from '@/modules/loyalty-point/loyalty-point.service';
import { MailService } from '@/shared/services/mail/mail.service';

@Injectable()
export class BonusClaimService {
  constructor(
    protected readonly userService: UserService,
    protected readonly bonusDataService: BonusDataService,
    protected readonly playerPassbookService: PlayerPassbookService,
    protected readonly scheduledExpiryService: ScheduledExpiryService,
    protected readonly balanceSheetService: BalanceSheetService,
    protected readonly socketClientService: SocketClientService,
    protected readonly loyaltyPointService: LoyaltyPointService,
    protected readonly sms: SmsService,
    protected readonly mail: MailService,
  ) {}
  /**
   * This method finds the player info which will be used in next function or further.
   * Also to check a valid request of player.
   * @param {Object} params conataing data of the list which is going to claimed.
   * @param {Function} cb Callback as response to next function
   */
  findPlayerInfo = (params: any) => {
    console.log('find Player info');
    const query = { playerId: params.playerId };
    return this.userService.findOne(query).then((player) => {
      if (!player) {
        throw new NotFoundException('Error in finding Player');
      }
      params.playerInfo = player;
    });
    // db.findUser(query, function(err, player){
    //     if(err){
    //         // error in finding player
    //         cb('Error in finding Player');
    //     } else{
    //         //add player info in params going ot use in next function
    //         cb(null, params);
    //     }
    // });
  };

  /**
   * This method gets the list of loyality levels and attach the levels with
   * params which is going to be used in further functions.
   *
   * @param {Object} params playerInfo and locked bonus going to release info
   * @param {Function} cb Callback Function
   */
  findAllVipLevels = async (params: any) => {
    const res = await this.loyaltyPointService.findAll({}).sort({ levelId: 1 });
    if (res.length <= 0) {
      throw new NotFoundException('MegaPoints list not found');
    }
    params.allLevels = res;
  };

  /**
   * This method is just for double verification that the point are greter than the claim amount.
   * @param {Object} params player data and bonus going to release info
   * @param {Function} cb Callback function
   */
  checkIfPossibletoUnclaim = (params: any) => {
    console.log('inside check if possiible to unclaim');
    if (
      params.playerInfo.statistics.countPointsForBonus >=
      params.lockedBonusAmount
    ) {
      //points enough to claim
      //now check if vip level going to change
      params.levelChange = this.checkThresholdCrossed(
        params.allLevels,
        params.playerInfo.statistics.megaPointLevel,
        params.playerInfo.statistics.megaPoints,
        params.lockedBonusAmount,
      ); // Boolean
    } else {
      //points not enough to claim
      throw new BadRequestException('Not enough points to claim');
    }
  };

  /**
   * This method return either the boolean value false or the Object containing value of the new levelId.
   * When level is not going to change return false, Otherwise new level.
   *
   * @param {Object} levels Array of Objects of vip level
   * @param {Number} levelId Level Id of the player
   * @param {Number} oldPoints Old VIP Points of the player
   * @param {Number} subPoints The points which is going to be subtracted
   */
  checkThresholdCrossed(levels, levelId, oldPoints, subPoints) {
    // Boolean
    // levels are / should be - SORTED by threshold
    console.log('here check threshold crossed for level change');
    const tmp = oldPoints - subPoints;
    const tmpLevelId = this.calculateLevelIdForPoints(levels, tmp);
    console.log('levelTemp Id--', tmpLevelId, levelId);
    if (levelId == tmpLevelId) {
      return false; // level not changed
    }
    return { value: tmpLevelId }; // new level
  }

  /**
   * This method returns the Vip level on the basis of the Vip points.
   *
   * @param {Array} levels Array of object of vip level
   * @param {Number} p vip points
   */
  calculateLevelIdForPoints(levels, p) {
    for (let i = 0; i < levels.length; i++) {
      if (p < levels[i].levelThreshold) {
        return (levels[i - 1] || levels[0]).levelId;
      }
    }
    return levels[levels.length - 1].levelId;
  }

  /**
   * This method is used to set release process start in the bonus data of the player.
   * @param {Object} params containing player info locked bonus data
   * @param {Function} cb Callabck
   */
  async setReleaseInPlayerBonus(params: any) {
    console.log('set expiry in bonus data of player');
    const query: any = {};
    query.playerId = params.playerId;
    query['bonus.uniqueId'] = params.uniqueId;
    const updateData = {};
    updateData['bonus.$.expireStatus'] = 2;
    updateData['bonus.$.unClaimedBonus'] = 0;
    updateData['bonus.$.claimedBonus'] = params.lockedBonusAmount;
    await this.bonusDataService.updateBounsDataSetKeys(query, updateData);
    params.prevUnclaimed = 0;
    const bonusResult = await this.bonusDataService.findOne({
      playerId: params.playerId,
    });
    if (bonusResult != null) {
      for (let i = 0; i < bonusResult.bonus.length; i++) {
        params.prevUnclaimed += bonusResult.bonus[i].unClaimedBonus;
      }
    }
  }

  /**
   * This method create the passbook entry of player for release of Locked Bonus.
   *
   * @param {Object} params conains playerInfo, vip level info
   */
  createPassbookEntry = (params) => {
    const query = { playerId: params.playerId };
    const passbookData: any = {};
    passbookData.time = Number(new Date());
    passbookData.prevAmt =
      params.playerInfo.realChips + params.playerInfo.instantBonusAmount;
    passbookData.amount = params.lockedBonusAmount;
    passbookData.newAmt =
      params.playerInfo.realChips +
      params.playerInfo.instantBonusAmount +
      params.lockedBonusAmount;
    passbookData.category = 'Bonus Released';
    passbookData.subCategory = 'Locked Bonus';
    this.playerPassbookService.createPassbookEntry(query, passbookData);
  };

  informPlayer(data) {
    const playerData = this.cashGamesChangedData(data);
    this.socketClientService.send('connector.entryHandler.broadcastPlayer', {
      data: playerData,
      route: 'updateProfile',
      playerId: data.playerId,
    });
  }

  cashGamesChangedData = function (data) {
    if (!!data.megaPointLevel) {
      return {
        updated: {
          realChips: data.playerRealChips,
          unclamedBonus: data.unclamedBonus,
          megaPoints: data.megaPoints,
          megaPointsPercent: data.megaPointsPercent,
          megaPointLevel: data.megaPointLevel,
        },
        playerId: data.playerId,
        event: 'REALCHIPSUPDATE',
      };
    } else {
      return {
        updated: {
          realChips: data.playerRealChips,
          unclamedBonus: data.unclamedBonus,
          megaPoints: data.megaPoints,
          megaPointsPercent: data.megaPointsPercent,
        },
        playerId: data.playerId,
        event: 'REALCHIPSUPDATE',
      };
    }
  };

  /**
   * This method add the claimed amount in player real chips and deduct the Vip points of the player.
   * @param {Object} params containing player info and locked bonus data of player
   * @param {Function} cb Callback function
   */
  async updatePlayerAmount(params: any) {
    const chipsData = { fundTransferAmount: params.lockedBonusAmount };
    await this.userService.updateUserBalance(chipsData, params.playerId);
    await this.createPassbookEntry(params);
    return params;
  }

  /**
   * This method used to update player stats i.e. vip points, vip level and count of vip.
   *
   * @param {Object} params contains playerInfo, locked bonus going to release info, vip levels
   * @param {Function} cb Callback Function
   */
  async updatePlayerStats(params: any) {
    const query = { playerId: params.playerId };
    const updateData: any = {};
    const broadcastData: any = {};
    updateData['statistics.megaPoints'] =
      params.playerInfo.statistics.megaPoints - params.lockedBonusAmount;
    updateData['statistics.countPointsForBonus'] =
      params.playerInfo.statistics.countPointsForBonus -
      params.lockedBonusAmount;
    if (params.levelChange) {
      updateData['statistics.megaPointLevel'] = params.levelChange.value;
      broadcastData.megaPointLevel = this.getLevelName(
        params.levelChange.value,
        params.allLevels,
      );
    }
    broadcastData.playerId = params.playerInfo.playerId;
    broadcastData.playerRealChips =
      params.playerInfo.realChips +
      params.playerInfo.instantBonusAmount +
      params.lockedBonusAmount;
    broadcastData.unclamedBonus = params.prevUnclaimed;
    broadcastData.megaPoints =
      params.playerInfo.statistics.megaPoints - params.lockedBonusAmount;
    broadcastData.megaPointsPercent = this.getLevelPercent(
      params.playerInfo.statistics.megaPoints - params.lockedBonusAmount,
      params.allLevels,
    );
    this.informPlayer(broadcastData);
    await this.userService.findAndModifyUser(query, updateData);
    return params;
    // db.findAndModifyUser(query, updateData, function (err, updatedStats) {
    //     if(err){
    //         cb('Error in updating vip points');
    //     }else{
    //         cb(null, params);
    //     }
    // });
  }

  getLevelPercent(points, levels) {
    if (points <= 0) {
      return 0;
    }
    if (levels.length <= 0) {
      return 0;
    }
    if (levels.length > 0) {
      function calculator(arr, value) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].levelThreshold > value) {
            // levelThreshold is min value of range
            break;
          }
        }
        if (i >= arr.length) {
          return 101; // any value > 100 to represent highest level
        }
        return (
          (100 * (value - arr[i - 1].levelThreshold)) /
          (arr[i].levelThreshold - arr[i - 1].levelThreshold)
        );
      }
      let c = calculator(levels, points);
      c = Math.floor(c * 100) / 100; // limiting decimal places
      return c || 0;
    }
  }

  /**
   * This method is used to update expiry doc, the expire status is changed to 2 (Released/cancelled),
   * Vip points and level before release and after release stored in this.
   *
   * @param {Object} params contains playerInfo, locked bonus going to release info, vip levels
   * @param {Function} cb Callback Function
   */
  async updateScheduleExpiryDoc(params: any) {
    console.log('inside update schedule expiry doc');
    const query: any = {};
    query.playerId = params.playerId;
    query.uniqueId = params.uniqueId;
    const updateData: any = {};
    updateData.expireStatus = 2;
    updateData.prevVipPoints = params.playerInfo.statistics.megaPoints;
    updateData.newVipPoints =
      params.playerInfo.statistics.megaPoints - params.lockedBonusAmount;
    updateData.prevVipLevel = this.getLevelName(
      params.playerInfo.statistics.megaPointLevel,
      params.allLevels,
    );
    updateData.releasedTime = Number(new Date());
    updateData.refrenceNumber = randomize('A0', 8);
    if (params.levelChange) {
      updateData.newVipLevel = this.getLevelName(
        params.levelChange.value,
        params.allLevels,
      );
    } else {
      updateData.newVipLevel = this.getLevelName(
        params.playerInfo.statistics.megaPointLevel,
        params.allLevels,
      );
    }
    params.playerPrevVipPoints = updateData.prevVipPoints;
    params.playerNewVipPoints = updateData.newVipPoints;
    params.playerPrevVipLevel = updateData.prevVipLevel;
    params.playerNewVipLevel = updateData.newVipLevel;
    const result = await this.scheduledExpiryService.updateOne(query, {
      $set: updateData,
    });
    return params;
    // db.updateExpirySlot(query, {$set: updateData}, function(err, result){
    //     if(err){
    //         cb('Error while updating Expiry slot');
    //     }else{
    //         cb(null, params);
    //     }
    // });
  }

  getLevelName(levelId, levels) {
    const t = _.findWhere(levels, { levelId: levelId }) || levels[0];
    return t.loyaltyLevel;
  }

  async updateBalanceSheet(params: any) {
    // try {
    const query = { $inc: { lockedBonusReleased: params.lockedBonusAmount } };
    await this.balanceSheetService.updateBalanceSheet(query);
    return params;
    // } catch(err) {
    //   console.error(err)
    //   throw new HttpException('Error while updating balance sheet. Player amount transferred.', 500);
    // }
    // financeDb.updateBalanceSheet(query, function(err, result){
    //     if(err){
    //         cb('Error while updating balance sheet. Player amount transferred.');
    //     }else{
    //         cb(null, params);
    //     }
    // });
  }

  /**
   * method used to send locked bonus claim message to the players
   */
  async sendBonusClaimedMessage(params: any) {
    console.log('inside sendBonusClaimedMessage player-->', params);
    const msg =
      'Dear ' +
      params.playerInfo.userName +
      ',\n' +
      'Congratulations!! You have unlocked ' +
      params.lockedBonusAmount +
      ' real chips and the chips has been credited to your PokerSD account.';
    const messageData = {
      mobileNumber: '91' + params.playerInfo.mobileNumber,
      msg: msg,
    };
    await this.sms.send(messageData);

    // sharedModule.sendOtp(messageData, function (otpApiResponse) {
    //     console.log('getting response while sending claim message');
    //     cb(null, params);
    // });
  }

  /**
   * method used to send the locked bonus claimed mail to the players.
   */
  async sendBonusClaimedMail(params: any) {
    if (!params.playerInfo.emailId) return;
    console.log('inside sendBonusClaimedMessage player-->', params);
    const mailData: any = {};
    mailData.userName = params.playerInfo.userName;
    mailData.claimedAmount = params.lockedBonusAmount;
    mailData.playerPrevVipPoints = params.playerPrevVipPoints;
    mailData.playerNewVipPoints = params.playerNewVipPoints;
    mailData.playerPrevVipLevel = params.playerPrevVipLevel;
    mailData.playerNewVipLevel = params.playerNewVipLevel;
    mailData.previousChips =
      params.playerInfo.realChips + params.playerInfo.instantBonusAmount;
    mailData.updatedChips =
      params.playerInfo.realChips +
      params.playerInfo.instantBonusAmount +
      params.lockedBonusAmount;
    mailData.vipPointsDeducted = params.lockedBonusAmount;
    // mailData.to_email = params.playerInfo.emailId;
    // mailData.from_email = process.env.FROM_EMAIL;
    // mailData.subject = 'Congratulations , PokerSD Locked Bonus Claimed';
    // mailData.template = 'lockedBonusClaimed';
    console.log('mailData inside the function', mailData);
    await this.mail.sendMailWithHtml({
      subject: 'Congratulations , PokerSD Locked Bonus Claimed',
      template: 'lockedBonusClaimed',
      to: params.playerInfo.emailId,
      data: mailData,
    });
    // sharedModule.sendMailWithHtml(mailData, function (result) {
    //     console.log('inside sendPasswordMailToPlayer @@@@', result);
    //     if (result.success) {
    //         console.log("here mail sent successfully");
    //         cb(null, params);
    //     } else {
    //         cb("Mail not sent to the player email id");
    //     }
    // });
  }

  /**
   * This method is used to claim the locked bonus of player from dashboard.
   */
  claimLockedBonusPlayer = async (params) => {
    console.log('inside claimLockedBonusPlayer the data is ', params);
    await this.findPlayerInfo(params);
    await this.findAllVipLevels(params);
    await this.checkIfPossibletoUnclaim(params);
    await this.setReleaseInPlayerBonus(params);
    await this.updatePlayerAmount(params);
    await this.updatePlayerStats(params);
    await this.updateScheduleExpiryDoc(params);
    await this.updateBalanceSheet(params);
    await this.sendBonusClaimedMessage(params);
    await this.sendBonusClaimedMail(params);
    return 'Bonus claimed Successfully.';
    // async.waterfall([
    //     async.apply(findPlayerInfo, req.body),
    //     findAllVipLevels,
    //     checkIfPossibletoUnclaim,
    //     setReleaseInPlayerBonus,
    //     updatePlayerAmount,
    //     updatePlayerStats,
    //     updateScheduleExpiryDoc,
    //     updateBalanceSheet,
    //     sendBonusClaimedMessage,
    //     sendBonusClaimedMail
    // ], function (err, result) {
    //     if(err){
    //         return res.json({success: false, info: err});
    //     }else{
    //         return res.json({success: true, result: "Bonus claimed Successfully."});
    //     }
    // });
  };
}
