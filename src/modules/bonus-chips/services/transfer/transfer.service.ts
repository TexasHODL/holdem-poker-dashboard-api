import { PlayerPassbookService } from '@/modules/player-passbook/player-passbook.service';
import { UserService } from '@/modules/user/user.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InstantBonusHistoryDto } from '../../dto/instant-bonus-history.dto';
import { ListUsersAndCalculateBonusDto } from '../../dto/list-users-and-calculate-bonus.dto';
import { BonusDataService } from '../bonus-data/bonus-data.service';
import { InstantBonusHistoryService } from '../instant-bonus-history/instant-bonus-history.service';
import * as uuid from 'uuid';
import { LoyaltyPointService } from '@/modules/loyalty-point/loyalty-point.service';
import { ScheduledExpiryService } from '../scheduled-expiry/scheduled-expiry.service';
import { BalanceSheetService } from '@/modules/finance/services/balance-sheet/balance-sheet.service';
import { SocketClientService } from '@/shared/services/socket-client/socket-client.service';
import { SmsService } from '@/shared/services/sms/sms.service';
import configs from '@/configs';
import { MailService } from '@/shared/services/mail/mail.service';
import { decrypt } from '@/v1/helpers/crypto';

const BONUSEXPIRE_PERIOD_INDAYS = 10;
@Injectable()
export class TransferService {
  constructor(
    @Inject(UserService)
    protected readonly userService: UserService,
    @Inject(PlayerPassbookService)
    protected readonly playerPassbookService: PlayerPassbookService,
    @Inject(InstantBonusHistoryService)
    protected readonly instantBonusHistoryService: InstantBonusHistoryService,
    @Inject(BonusDataService)
    protected readonly bonusDataService: BonusDataService,
    @Inject(LoyaltyPointService)
    protected readonly loyaltyPointService: LoyaltyPointService,
    @Inject(ScheduledExpiryService)
    protected readonly scheduledExpiryService: ScheduledExpiryService,
    @Inject(BalanceSheetService)
    protected readonly balanceSheetService: BalanceSheetService,
    @Inject(SocketClientService)
    protected readonly socketClientService: SocketClientService,
    @Inject(SmsService)
    protected readonly sms: SmsService,
    @Inject(MailService)
    protected readonly mail: MailService,
  ) {}
  async instantBonusTransfer (params: InstantBonusHistoryDto) {
    console.log("inside instantBonusTransfer", params);
    
    const user = await this.checkPlayerPromoBonus(params);
    await this.updateUserInstantBonus(user, params);
    const instantBonusHistory = await this.saveInstantBonusHistory(params);
    await this.savePlayerBonusData(user, params);
    await this.saveExpiryDocument(params);
    await this.addAmountInBalanceSheet(params);
    this.broadcastPlayerData(params);
    await this.sendLockedMessageIfRequired(params);
    await this.sendSignUpMessageIfRequired(params);
    this.sendMailIfRequired(params);
    return instantBonusHistory;
    // console.log("params", req.body);
    // params = req.body;
    // async.waterfall([
    //     async.apply(checkPlayerPromoBonus, params),
    //     updateUserInstantBonus,
    //     saveInstantBonusHistory,
    //     savePlayerBonusData,
    //     saveExpiryDocument,
    //     addAmountInBalanceSheet,
    //     broadcastPlayerData,
    //     sendLockedMessageIfRequired,
    //     sendSignUpMessageIfRequired,
    //     sendMailIfRequired
    // ], function (err, result) {
    //     console.log("err and result final", err, result);
    //     if (err) {
    //         return res.json({ success: false, info: err });
    //     } else {
    //         return res.json({ success: true, result: result });
    //     }
    // });
  }

  async checkPlayerPromoBonus(params: InstantBonusHistoryDto) {
    console.log('Inside checkPlayerPromoBonus function', params);
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    const user = await this.userService.findOne(query);
    if (!user) {
      throw new BadRequestException('No such player Exists !!');
    }
    if (params.transferType == 'signUp') {
      if (user.promoBonusAwarded) {
        throw new BadRequestException(
          'Sign up bonus already awarded for this player',
        );
      }
      await this.userService.update(user.id, {
        promoBonusAwarded: true,
      });
      console.log('sucessfully updated player promo bonus');
      return user;
      // old logic
      // db.findUser(query, function (err, result) {
      //   if (!err && result != null) {
      //     if (result.promoBonusAwarded) {
      //       cb("Sign up bonus already awarded for this player");
      //     } else {
      //       updateData = { promoBonusAwarded: true }
      //       db.updateUser(query, updateData, function (error, result1) {
      //         if (error) {
      //           cb("Unable to transfer bonus to player");
      //         } else {
      //           cb(null, params);
      //         }
      //       });
      //     }
      //   } else {
      //     cb("No such player Exists !!");
      //   }
      // });
    }
    return user;
  }

  async updateUserInstantBonus(user, params) {
    if (params.amount) {
      const query: any = {};
      if (params.userName) {
        query.userName = eval('/^' + params.userName + '$/i');
      }
      const updateData = { $inc: { instantBonusAmount: params.amount } };
      const result = await this.userService.addInstantBonusAmount(
        query,
        updateData,
      );
      if (result && result.value) {
        params.parentUserName = result.value.isParentUserName;
        params.playerEmail = result.value.emailId;
        params.playerInstantBonus = result.value.instantBonusAmount;
        params.playerId = result.value.playerId;
        params.playerRealChips = result.value.realChips;
        params.playerVipPoints = result.value.statistics.megaPoints;
        params.playerVipLevel = result.value.statistics.megaPointLevel;
        params.playerMobileNumber = result.value.mobileNumber;
        await this.createInstantBonusPassbookEntry(params);
      }
    } else {
      params.parentUserName = user.isParentUserName;
      params.playerEmail = user.emailId;
      params.playerInstantBonus = user.instantBonusAmount;
      params.playerId = user.playerId;
      params.playerRealChips = user.realChips;
      params.playerVipPoints = user.statistics.megaPoints;
      params.playerVipLevel = user.statistics.megaPointLevel;
      params.playerMobileNumber = user.mobileNumber;
    }
    return params;

    // console.log("inside updateUserInstantBonus");
    // if (params.amount) {
    //   query = {}
    //   if (params.userName) {
    //     query.userName = eval('/^' + params.userName + '$/i');
    //   }
    //   updateData = { $inc: { instantBonusAmount: params.amount } }
    //   db.addInstantBonusAmount(query, updateData, function (err, result) {
    //     if (!err && result != null) {
    //       console.log("err,result....", err, result);
    //       if (result.value != null) {
    //         params.parentUserName = result.value.isParentUserName;
    //         params.playerEmail = result.value.emailId;
    //         params.playerInstantBonus = result.value.instantBonusAmount;
    //         params.playerId = result.value.playerId;
    //         params.playerRealChips = result.value.realChips;
    //         params.playerVipPoints = result.value.statistics.megaPoints;
    //         params.playerVipLevel = result.value.statistics.megaPointLevel;
    //         params.playerMobileNumber = result.value.mobileNumber;
    //         this.createInstantBonusPassbookEntry(params);
    //         cb(null, params);
    //       } else {
    //         cb("No such player Exists !!");
    //       }
    //     } else {
    //       cb("Unable to transfer instant bonus to player with this username!");
    //     }
    //   });
    // } else {
    //   db.findUser({ userName: eval('/^' + params.userName + '$/i') }, function (err, result) {
    //     if (err) {
    //       cb('Error while getting player info');
    //     } else {
    //       params.parentUserName = result.isParentUserName;
    //       params.playerEmail = result.emailId;
    //       params.playerInstantBonus = result.instantBonusAmount;
    //       params.playerId = result.playerId;
    //       params.playerRealChips = result.realChips;
    //       params.playerVipPoints = result.statistics.megaPoints;
    //       params.playerVipLevel = result.statistics.megaPointLevel;
    //       params.playerMobileNumber = result.mobileNumber;
    //       cb(null, params);
    //     }
    //   });
    // }
  }

  async sendLockedMessageIfRequired(params) {
    console.log('inside sendLockedMessageIfRequired function', params);
    if (params.lockedBonusAmount > 0 && params.transferType != 'signUp') {
      const msg =
        'Dear ' +
        params.userName +
        ',\n' +
        'A locked bonus of ' +
        params.lockedBonusAmount +
        ' has been added to your PokerSD account , generate ' +
        parseInt(
          (
            (params.lockedBonusAmount * configs.app.PERCENTFOR_BONUSRELEASE) /
            100
          ).toString(),
        ) +
        ' VIP points before ' +
        new Date(params.bonusExpiredAt + 330 * 60 * 1000).toLocaleString() +
        ' to get it unlocked . \n' +
        'Cheers !!';
      const messageData = {
        mobileNumber: '91' + params.playerMobileNumber,
        msg: msg,
      };
      await this.sms.send(messageData);
    }
    // console.log("inside sendLockedMessageIfRequired function", params);
    // if (params.lockedBonusAmount > 0 && params.transferType != "signUp") {
    //   msg = "Dear " + params.userName + ",\n" + "A locked bonus of " + params.lockedBonusAmount + " has been added to your PokerSD account , generate " + parseInt((params.lockedBonusAmount * configConstants.PERCENTFOR_BONUSRELEASE) / 100) + " VIP points before " + new Date(params.bonusExpiredAt + (330 * 60 * 1000)).toLocaleString() + " to get it unlocked . \n" + "Cheers !!";
    //   messageData = {
    //     mobileNumber: '91' + params.playerMobileNumber,
    //     msg: msg
    //   }
    //   sharedModule.sendOtp(messageData, function (otpApiResponse) {
    //     console.log('getting response from otp api');
    //     cb(null, params);
    //   });
    // } else {
    //   cb(null, params);
    // }
  }

  async sendSignUpMessageIfRequired(params) {
    console.log('inside sendSignUpMessageIfRequired function', params);
    if (params.transferType == 'signUp') {
      const msg =
        'Dear ' +
        params.userName +
        ',\n\n' +
        'Your KYC is completed and you have been awarded a signup bonus of Rs. ' +
        parseInt(params.lockedBonusAmount + params.amount) +
        '.' +
        '\nJoin the table now to win real money. \n\n' +
        'Visit www.pokersd.com.';
      const messageData = {
        mobileNumber: '91' + params.playerMobileNumber,
        msg: msg,
      };
      await this.sms.send(messageData);
    }
    // console.log("inside sendSignUpMessageIfRequired function", params);
    // if (params.transferType == "signUp") {
    //   msg = "Dear " + params.userName + ",\n\n" + "Your KYC is completed and you have been awarded a signup bonus of Rs. " + parseInt(params.lockedBonusAmount + params.amount) + "." + "\nJoin the table now to win real money. \n\n" + "Visit www.pokersd.com.";
    //   messageData = {
    //     mobileNumber: '91' + params.playerMobileNumber,
    //     msg: msg
    //   }
    //   sharedModule.sendOtp(messageData, function (otpApiResponse) {
    //     console.log('getting response from otp api');
    //     cb(null, params);
    //   });
    // } else {
    //   cb(null, params);
    // }
  }

  async sendMailIfRequired(params) {
    console.log('inside sendMAilIfRequired function', params);
    if (params.sendMail && params.playerEmail) {
      await this.mail.sendMailWithHtml({
        to: params.playerEmail,
        subject: 'PokerSD Bonus Transfer',
        template: 'instantBonusTransfer',
        data: {
          userName: params.userName,
          amount: params.amount,
        },
      });
    }

    // console.log("inside sendMAilIfRequired function", params);
    // if (params.sendMail) {
    //   mailData = {}
    //   mailData.userName = params.userName;
    //   mailData.amount = params.amount;
    //   mailData.mailText = params.mailText;
    //   mailData.to_email = params.playerEmail;
    //   mailData.from_email = process.env.FROM_EMAIL;
    //   mailData.subject = 'PokerSD Bonus Transfer';
    //   mailData.template = 'instantBonusTransfer';
    //   sharedModule.sendMailWithHtml(mailData, function (result) {
    //     console.log('inside sendPasswordMailToPlayer @@@@', result);
    //     if (result.success) {
    //       console.log("here mail sent successfully");
    //       cb(null, params);
    //     } else {
    //       cb("Mail not sent to the player email id");
    //     }
    //   });
    // } else {
    //   cb(null, params);
    // }
  }

  saveInstantBonusHistory(params: InstantBonusHistoryDto) {
    return this.instantBonusHistoryService.create(params);
    // console.log("inside saveInstantBonusHistory function");
    // instantBonusHistoryData = {}
    // instantBonusHistoryData.userName = params.userName;
    // instantBonusHistoryData.amount = params.amount;
    // instantBonusHistoryData.type = params.transferType;
    // instantBonusHistoryData.time = params.transferAt;
    // instantBonusHistoryData.comments = params.comments;
    // instantBonusHistoryData.parentUserName = params.parentUserName;
    // instantBonusHistoryData.promoCode = "";
    // instantBonusHistoryData.lockedBonusAmount = params.lockedBonusAmount;
    // instantBonusHistoryData.bonusChipsType = params.bonusChipsType;
    // db.saveInstantBonusHistory(instantBonusHistoryData, function (err, result) {
    //   if (!err && result != null) {
    //     console.log("Inside saveInstantBonusHistory function err,result", err, result);
    //     cb(null, params);
    //   } else {
    //     cb("Unable to save this transaction in instant bonus history");
    //   }
    // });
  }

  async savePlayerBonusData(user, params) {
    console.log('inside saveBonusData method');
    if (params.lockedBonusAmount > 0) {
      
      const query = {
        // playerId: params.playerId
        playerId: user.playerId,
      };
      const bonusData: any = {};
      const data: any = {};
      data.createdAt = Number(new Date());
      data.bonusId = '';
      data.name = params.transferType;
      data.unClaimedBonus = params.lockedBonusAmount || 0;
      data.instantBonusAmount = params.amount || 0;
      data.claimedBonus = 0;
      data.expireAt = this.setExpiry(data.createdAt);
      data.uniqueId = uuid.v4();
      data.expireStatus = 0;
      data.expiredAmt = 0;
      bonusData.bonus = data;
      params.prevUnclaimed = 0;
      params.bonusCreditedAt = data.createdAt;
      params.bonusExpiredAt = data.expireAt;
      params.playerId = user.playerId;

      const bonusResult = await this.bonusDataService.findOne(query);
      params.bonusData = data;

      for (let i = 0; i < bonusResult.bonus.length; i++) {
        params.prevUnclaimed += bonusResult.bonus[i].unClaimedBonus;
      }
      this.createLockedPassbookEntry(params);
    } else {
      console.log('Not required to save bonus data');
    }
    return params;

    // if (params.lockedBonusAmount > 0) {
    //   const query = {
    //     playerId: params.playerId
    //   }
    //   const bonusData = {}
    //   const data = {}
    //   data.createdAt = Number(new Date());
    //   data.bonusId = "";
    //   data.name = params.transferType;
    //   data.unClaimedBonus = params.lockedBonusAmount || 0;
    //   data.instantBonusAmount = params.amount || 0;
    //   data.claimedBonus = 0;
    //   data.expireAt = setExpiry(data.createdAt);
    //   data.uniqueId = uuid.v4();
    //   data.expireStatus = 0;
    //   data.expiredAmt = 0;
    //   bonusData.bonus = data;
    //   params.prevUnclaimed = 0;
    //   params.bonusCreditedAt = data.createdAt;
    //   params.bonusExpiredAt = data.expireAt;
    //   db.findBounsData(query, function (err, bonusResult) {
    //     if (!err) {
    //       if (bonusResult !== null) {
    //         db.updateBounsData(query, bonusData, function (err, bonusUpdateResult) {
    //           console.log("Bonus data updated");
    //           params.bonusData = data;
    //           cb(null, params);
    //         });
    //         for (i = 0; i < bonusResult.bonus.length; i++) {
    //           params.prevUnclaimed += bonusResult.bonus[i].unClaimedBonus;
    //         }
    //         console.log(params.prevUnclaimed);
    //         createLockedPassbookEntry(params);
    //       } else {
    //         cb("Bonus might be added, but bonus data not saved, Kindly check passbook.");
    //       }
    //     } else {
    //       cb("Bonus might be added, but bonus data not saved, Kindly check passbook.");
    //     }
    //   });
    // } else {
    //   console.log("Not required to save bonus data");
    //   cb(null, params);
    // }
  }

  async saveExpiryDocument(params) {
    if (params.lockedBonusAmount > 0) {
      const data: any = {};
      data.playerId = params.playerId;
      data.userName = params.userName;
      data.lockedBonusAmount = params.lockedBonusAmount;
      data.createdAt = params.bonusData.createdAt;
      data.expireAt = params.bonusData.expireAt;
      data.uniqueId = params.bonusData.uniqueId;
      data.vipPoints = params.playerVipPoints;
      data.expireStatus = 0; // 0-scheduled; 1-expired; 2-cancelled;
      data.mode = params.transferType;
      const result = await this.findVipLevelName(params.playerVipLevel);
      data.vipLevel = result;
      await this.scheduledExpiryService.create(data);
    }
    //   if (params.lockedBonusAmount > 0) {
    //     const data = {}
    //     data.playerId = params.playerId;
    //     data.userName = params.userName;
    //     data.lockedBonusAmount = params.lockedBonusAmount;
    //     data.createdAt = params.bonusData.createdAt;
    //     data.expireAt = params.bonusData.expireAt;
    //     data.uniqueId = params.bonusData.uniqueId;
    //     data.vipPoints = params.playerVipPoints;
    //     data.expireStatus = 0;   // 0-scheduled; 1-expired; 2-cancelled;
    //     data.mode = params.transferType;
    //     findVipLevelName(params.playerVipLevel, function (error, result) {
    //       data.vipLevel = result;
    //       console.log("Going to save expiry document of locked bonus.", data);
    //       db.createExpirySlot(data, function (err, res) {
    //         console.log('saved slot in db ' + JSON.stringify(res));
    //         cb(null, params);
    //       });
    //     });

    //   } else {
    //     cb(null, params);
    //   }
  }

  async findVipLevelName(playerVipLevel) {
    const res = await this.loyaltyPointService.findAllMegaPointLevels({});
    return this.getLevelName(playerVipLevel, res);
    // adminDb.findAllMegaPointLevels({}, function (err, res) {
    //     console.log("err12 ,res",err,res);
    //     if (err || !res) {
    //         cb(null,"");
    //     } else {
    //         cb(null,getLevelName(playerVipLevel,res));
    //     }
    // });
  }

  getLevelName(levelId, levels) {
    const t = levels.find((x) => x.levelId === levelId) || levels[0];
    return t.loyaltyLevel;
  }

  async broadcastPlayerData(params) {
    const broadcastData: any = {};
    broadcastData.playerId = params.playerId;
    if (params.lockedBonusAmount > 0) {
      broadcastData.lockedBonusAmount =
        params.lockedBonusAmount + params.prevUnclaimed;
    }
    if (params.amount > 0) {
      broadcastData.playerRealChips =
        params.amount + params.playerRealChips + params.playerInstantBonus;
    }
    await this.informPlayer(broadcastData);
    // cb(null, params);
    // const broadcastData = {}
    // broadcastData.playerId = params.playerId;
    // if (params.lockedBonusAmount > 0) {
    //   broadcastData.lockedBonusAmount = params.lockedBonusAmount + params.prevUnclaimed;
    // }
    // if (params.amount > 0) {
    //   broadcastData.playerRealChips(params.amount + params.playerRealChips + params.playerInstantBonus);
    // }
    // informPlayer(broadcastData);
    // cb(null, params);
  }

  async informPlayer(data) {
    await this.socketClientService.init();
    const playerData = this.cashGamesChangedData(data);
    const res = await this.socketClientService.request(
      'connector.entryHandler.broadcastPlayer',
      { data: playerData, route: 'updateProfile', playerId: data.playerId },
    );
    this.socketClientService.disconnect();
    // console.log('data in informPlayer is - ' + JSON.stringify(data));
    // console.log('rootTools.connectorHost - ' + rootTools.connectorHost);
    // pomelo.init({
    //   host: rootTools.connectorHost,
    //   port: rootTools.connectorPort,
    //   log: true
    // }, function () {
    //   var playerData = this.cashGamesChangedData(data);
    //   console.log('tournament data is - ' + JSON.stringify(playerData));
    //   if(playerData){
    //     pomelo.request('connector.entryHandler.broadcastPlayer', { data: playerData, route: 'updateProfile', playerId: data.playerId }, function (err, data) {
    //       console.log('line 301', err, data);
    //       pomelo.disconnect();
    //     });
    //   }else{
    //     pomelo.disconnect();
    //   }
    // });
  }

  cashGamesChangedData = function (data) {
    if (data.playerRealChips > 0 && data.lockedBonusAmount > 0) {
      return {
        updated: {
          realChips: data.playerRealChips,
          unclamedBonus: data.lockedBonusAmount,
        },
        playerId: data.playerId,
        event: 'REALCHIPSUPDATE',
      };
    } else if (data.lockedBonusAmount > 0) {
      return {
        updated: {
          unclamedBonus: data.lockedBonusAmount,
        },
        playerId: data.playerId,
        event: 'REALCHIPSUPDATE',
      };
    } else if (data.playerRealChips > 0) {
      return {
        updated: {
          realChips: data.playerRealChips,
        },
        playerId: data.playerId,
        event: 'REALCHIPSUPDATE',
      };
    } else {
      return false;
    }
  };

  createInstantBonusPassbookEntry(params) {
    const passbookData = {
      time: params.transferAt,
      category: 'Instant Bonus Transfer',
      prevAmt: params.playerInstantBonus + params.playerRealChips,
      newAmt:
        params.playerInstantBonus + params.amount + params.playerRealChips,
      amount: params.amount,
      subCategory:
        params.transferType == 'signUp'
          ? 'Sign Up Bonus'
          : params.transferType == 'promotion'
          ? 'promotion bonus'
          : params.transferType,
    };
    const query: any = {};
    query.playerId = params.playerId;
    console.log(
      'Inside createInstantBonusPassbookEntry function',
      passbookData,
    );
    return this.playerPassbookService.createPassbookEntry(query, passbookData);

    // var passbookData = {
    //   time: params.transferAt,
    //   category: "Instant Bonus Transfer",
    //   prevAmt: params.playerInstantBonus + params.playerRealChips,
    //   newAmt: params.playerInstantBonus + params.amount + params.playerRealChips,
    //   amount: params.amount,
    //   subCategory: params.transferType == "signUp" ? "Sign Up Bonus" : params.transferType == "promotion" ? "promotion bonus" : params.transferType
    // };
    // var query = {};
    // query.playerId = params.playerId;
    // console.log("Inside createInstantBonusPassbookEntry function", passbookData);
    // adminDb.createPassbookEntry(query, passbookData, function (err, result) {
    //   if (!err && result) {
    //     console.log("result coming from the database -->", result);
    //   } else {
    //     console.log("Error coming while saving the Instant bonus transfer transaction in player passbook");
    //   }
    // });
  }

  async createLockedPassbookEntry(params) {
    // console.log("createLockedPassbookEntry", params.prevUnclaimed);
    // var query = { playerId: params.playerId };
    // const passbookData = {
    //     time: Number(new Date()),
    //     category: "Locked Bonus Transfer",
    //     prevAmt: params.prevUnclaimed,
    //     newAmt: params.prevUnclaimed + params.lockedBonusAmount,
    //     amount: params.lockedBonusAmount,
    //     subCategory: params.transferType == "signUp" ? "Sign Up Bonus" : params.transferType == "promotion" ? "Promotion bonus" : params.transferType
    // };
    // adminDb.createPassbookEntry(query, passbookData, function (err, result) {
    //     if (!err && result) {
    //         console.log("Passbook updated for locked Bonus");
    //     } else {
    //         console.log("Passbook not updated for locked");
    //     }
    // });
    const query = { playerId: params.playerId };
    const passbookData = {
      time: Number(new Date()),
      category: 'Locked Bonus Transfer',
      prevAmt: params.prevUnclaimed,
      newAmt: params.prevUnclaimed + params.lockedBonusAmount,
      amount: params.lockedBonusAmount,
      subCategory:
        params.transferType == 'signUp'
          ? 'Sign Up Bonus'
          : params.transferType == 'promotion'
          ? 'Promotion bonus'
          : params.transferType,
    };
    return await this.playerPassbookService.createPassbookEntry(
      query,
      passbookData,
    );
  }

  setExpiry = (time) => {
    let x = time + BONUSEXPIRE_PERIOD_INDAYS * 24 * 60 * 60 * 1000; // turn on the commented for production
    x = new Date(x);
    x.setHours(18);
    x.setMinutes(29);
    x.setSeconds(59);
    return Number(x);
  };

  async addAmountInBalanceSheet(params) {
    try {
      const query = {
        $inc: {
          instantBonusAmount: params.amount,
          lockedBonusAmount: params.lockedBonusAmount,
        },
      };
      await this.balanceSheetService.updateBalanceSheet(query);
    } catch (e) {
      e.submessage = 'Error in updating balance sheet';
      throw e;
    }
    // var query = { $inc: { instantBonusAmount: params.amount, lockedBonusAmount : params.lockedBonusAmount} };
    // financeDB.updateBalanceSheet(query, function (err, result) {
    //     console.trace("inside update instantBonusAmount in balance sheet--");
    //     if (err) {
    //         cb('Error in updating balance sheet');
    //     } else {
    //         cb(null, params);
    //     }
    // })
  }

  async listPlayersAndAssignBonus(dto: ListUsersAndCalculateBonusDto) {
    console.log('inside listPlayersAndAssignBonus ', dto);
    const players = (await this.findPlayersDataForCalculatingBonus(dto))
      console.log("players=========== ", players);
    await this.assignUnclaimedBonusToPlayers(players);
    const data = await this.assignLastLoginToPlayers(players);
    // console.log("inside listPlayersAndAssignBonus ", req.body);
    // async.waterfall([
    //     async.apply(findPlayersDataForCalculatingBonus, req.body),
    //     assignUnclaimedBonusToPlayers,
    //     assignLastLoginToPlayers
    // ], function (err, result) {
    //     if (!err && result) {
    //         return res.json({ success: true, result: result });
    //     }
    //     else {
    //         return res.json({ success: false, info: "Unable to find players data." });
    //     }
    // });
    return data;
  }

  async findPlayersDataForCalculatingBonus(params) {
    console.log("inside findPlayersDataForCalculatingBonus: ", params);
    const res = await this.userService.findPlayer(params);
    if (res.length === 0) {
      throw new BadRequestException('unable to find players data');
    }
    return res;
  }

  async assignUnclaimedBonusToPlayers(players: any[]) {
    const res = await this.bonusDataService.findAll({
      playerId: {
        $in: players.map((x) => x.playerId),
      },
    });
    for (const player of players) {
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
    return players;
    // async.eachSeries(params, function (element, callback) {
    //     var query = { playerId: element.playerId };
    //     db.findBounsData(query, function (err, result) {
    //         var unclaimedBonusAmount = 0;
    //         var claimedBonusAmount = 0;
    //         if (!err && result) {
    //             for (var j = 0; j < result.bonus.length; j++) {
    //                 unclaimedBonusAmount += result.bonus[j].unClaimedBonus;
    //                 claimedBonusAmount += result.bonus[j].claimedBonus;
    //             }
    //         }
    //         element.unclaimedBonusAmount = unclaimedBonusAmount;
    //         element.claimedBonusAmount = claimedBonusAmount;
    //         callback();
    //     });
    // }, function (err) {
    //     if (err) {
    //         cb({ success: false, info: "Something went wrong!" });
    //     }
    //     else {
    //         cb(null, params);
    //     }
    // });
  }

  assignLastLoginToPlayers(players) {
    const currentDate = Number(new Date());
  
    const updatedPlayers = players.map(player => {
      let temp1 = (currentDate - player.lastLogin) / (1000 * 60 * 60 * 24);
      let temp2 = Math.floor(temp1);
      let hours = Math.floor((temp1 - temp2) * 24);
  
      if (temp2 < 0) {
        temp2 = 0;
        hours = 0;
      }
  
      return {
        ...player._doc,
        noOfDays: temp2,
        hours: hours,
        password: decrypt(player.password).result,
      };
    });

    let player = []

    for (let playerData of updatedPlayers) {
      player.push({
        ...playerData._doc,
        unclaimedBonusAmount: playerData.unclaimedBonusAmount,
        claimedBonusAmount: playerData.playerData,
        noOfDays: playerData.noOfDays,
        hours: playerData.hours,
        password: playerData.password
      })
    }
  
    console.log("updatedPlayers: ", updatedPlayers);
    return updatedPlayers;
  }
}
