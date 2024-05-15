import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { SocketClientService } from '@/shared/services/socket-client/socket-client.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { PendingCashoutRequestService } from '../cashout/services/pending-cashout-request/pending-cashout-request.service';
import { AffiliateService } from '../user/services/affiliate/affiliate.service';
import { UserService } from '../user/user.service';
import { CreatePullChipDto } from './dto/create-pull-chip.dto';
import { UpdatePullChipDto } from './dto/update-pull-chip.dto';
import { InstantChipsPulledHistory } from './entities/instantChipsPulledHistory.entity';
import async from "async";
import { RequestDataService } from '@/shared/services/request-data/request-data.service';
import { PlayerPassbookService } from "../player-passbook/player-passbook.service";
import { BalanceSheetService } from "../finance/services/balance-sheet/balance-sheet.service";

@Injectable()
export class PullChipsService {
  constructor(
    protected readonly userService: UserService,
    protected readonly affiliateService: AffiliateService,
    protected readonly pendingCashoutRequestService: PendingCashoutRequestService,
    protected readonly socketClientService: SocketClientService,
    @InjectAdminModel(AdminDBModel.InstantChipsPulledHistory)
    protected readonly instantChipsPulledHistory: Model<InstantChipsPulledHistory>,
    protected readonly requestDataService: RequestDataService, 
    protected readonly playerPassbookService: PlayerPassbookService,
    protected readonly balanceSheetService: BalanceSheetService
  ) {}
  create(createPullChipDto: CreatePullChipDto) {
    return 'This action adds a new pullChip';
  }

  findAll() {
    return `This action returns all pullChips`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pullChip`;
  }

  update(id: number, updatePullChipDto: UpdatePullChipDto) {
    return `This action updates a #${id} pullChip`;
  }

  remove(id: number) {
    return `This action removes a #${id} pullChip`;
  }

  async searchAffiliate(params) {
    const query: any = {};
    query.userName = eval('/^' + params.userName + '$/i');
    const result = await this.affiliateService.findOne(query);
    if (!result) {
      throw new BadRequestException('Unable to find affiliate data');
    }
    return result.toObject();
  }

  async checkUserData(params) {
    console.log('in checkPlayerData ' + JSON.stringify(params));

    const user: any[] = await this.affiliateService.findAll({
      userName: eval('/^' + params.userName + '$/i'),
      // userName: params.userName,
    });

    if (user !== null && user.length > 0) {
      if (user[0].role.level <= 0) {
        params.userData = user[0];
        return params;
      } else {
        throw new BadRequestException('Not an affiliate');
      }
    } else {
      throw new BadRequestException('User does not found');
    }
  }

  checkUserWithdrawlRealChips(params) {
    if (params.withdrawalType != 'realChips') {
      return params;
    }
    console.log(
      parseInt(params.WithdrawAmmount),
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      parseInt(params.userData.realChips),
    );
    if (
      parseInt(params.WithdrawAmmount) != 0 &&
      parseInt(params.WithdrawAmmount) <= parseInt(params.userData.realChips)
    ) {
      if (params.userData.chipsManagement.withdrawlCount >= 11111115) {
        var lastTransactionDate = new Date(
          params.userData.chipsManagement.withdrawlDate,
        ).toDateString();
        var todaysDate = new Date().toDateString();
        if (todaysDate > lastTransactionDate) {
          params.userData.chipsManagement.withdrawlCount = 0;
        } else {
          throw new BadRequestException(
            'Number of withdrawl exausted for today',
          );
        }
      }
      return params;
    } else {
      throw new BadRequestException('Requested Amount is not Alloweded');
    }
  }

  checkUserWithdrawlRakeChips(params) {
    if (params.withdrawalType != 'rakeAmount') {
      return params;
    }
    console.log(
      parseInt(params.WithdrawAmmount),
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      parseInt(params.userData.profit),
    );
    if (
      parseInt(params.WithdrawAmmount) != 0 &&
      parseInt(params.WithdrawAmmount) <= parseInt(params.userData.profit)
    ) {
      if (params.userData.chipsManagement.profitCount >= 1111112) {
        var lastTransactionDate = new Date(
          params.userData.chipsManagement.profitWithdrawlDate,
        ).toDateString();
        var todaysDate = new Date().toDateString();
        console.log('#@#@#@#@#@#@#@#@#@@#@', todaysDate > lastTransactionDate);
        if (todaysDate > lastTransactionDate) {
          params.userData.chipsManagement.profitCount = 0;
        } else {
          throw new BadRequestException(
            'Number of withdrawl exausted for today',
          );
        }
      }
      return params;
    } else {
      throw new BadRequestException('Requested Amount is not Alloweded');
    }
  }

  calculateUserTDSRealChips(params) {
    if (params.withdrawalType != 'realChips') {
      return params;
    }

    console.log('!!!!!!!!!@@@@@@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!', params);

    var tempCalculator =
      params.WithdrawAmmount - params.userData.chipsManagement.deposit;
    params.userData.realChips =
      params.userData.realChips - params.WithdrawAmmount;
    params.currentDepositAmount = params.userData.chipsManagement.deposit;
    params.userData.chipsManagement.deposit =
      params.userData.chipsManagement.deposit - params.WithdrawAmmount;
    if (params.userData.chipsManagement.deposit >= 0) {
      params.currentDepositAmount = params.WithdrawAmmount;
    }
    params.userData.chipsManagement.withdrawlCount += 1;
    params.userData.chipsManagement.withdrawlDate = Number(new Date());
    params.DeductAmount = 0;
    params.processingFees = 0;
    params.effectiveWithdrawlAmount =
      params.WithdrawAmmount - params.DeductAmount;
    params.tdsType = 'Real Chips';
    return params;
  }

  calculateUserTDSRakeChips(params) {
    if (params.withdrawalType != 'rakeAmount') {
      return params;
    }
    params.userData.profit = params.userData.profit - params.WithdrawAmmount;
    params.currentDepositAmount = params.userData.chipsManagement.deposit;
    params.userData.chipsManagement.profitCount += 1;
    params.userData.chipsManagement.profitWithdrawlDate = Number(new Date());
    params.DeductAmount = 0;
    params.processingFees = 0;
    params.effectiveWithdrawlAmount = params.WithdrawAmmount - 0;
    params.tdsType = 'Profit';
    return params;
  }

  async generateWithdrawlRequestAff(params) {
    const query: any = {};
    query.userName = params.userData.userName;
    const updateKeys: any = {};
    updateKeys.realChips = params.userData.realChips;
    updateKeys.profit = params.userData.profit;
    if (params.userData.chipsManagement.deposit < 0) {
      params.userData.chipsManagement.deposit = 0;
    }
    const chipManagement: any = {};
    chipManagement.deposit = params.userData.chipsManagement.deposit;
    chipManagement.WithDrawl = 0;
    chipManagement.withdrawlCount =
      params.userData.chipsManagement.withdrawlCount;
    chipManagement.profitCount = params.userData.chipsManagement.profitCount;
    chipManagement.withdrawlPercent =
      params.userData.chipsManagement.withdrawlPercent;
    chipManagement.withdrawlDate =
      params.userData.chipsManagement.withdrawlDate;
    chipManagement.profitWithdrawlDate =
      params.userData.chipsManagement.profitWithdrawlDate;
    updateKeys.chipsManagement = chipManagement;
    const updatedUser = await this.affiliateService.updateteAffiliateCashout(
      updateKeys,
      query,
    );

    if (updatedUser) {
      await this.createWithdrawlRequestAff(params);
      return params;
    }
  }

  createUniqueId() {
    var text = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async createWithdrawlRequestAff(params) {
    var withDrawlRequestGeneration: any = {};
    withDrawlRequestGeneration.requestedAmount = params.WithdrawAmmount;
    withDrawlRequestGeneration.netAmount = params.effectiveWithdrawlAmount;
    withDrawlRequestGeneration.name = 'N/A';
    withDrawlRequestGeneration.realName = params.userData.name;
    withDrawlRequestGeneration.userName = params.userData.userName;
    withDrawlRequestGeneration.accountNumber = 'N/A';
    withDrawlRequestGeneration.ifcsCode = 'N/A';
    withDrawlRequestGeneration.bankName = 'N/A';
    withDrawlRequestGeneration.branchName = 'N/A';
    withDrawlRequestGeneration.affiliateId = 'N/A';
    withDrawlRequestGeneration.affiliateMobile = params.userData.mobileNumber;
    withDrawlRequestGeneration.profile = 'AGENT';
    withDrawlRequestGeneration.accountType = 'N/A';
    withDrawlRequestGeneration.referenceNo = this.createUniqueId();
    withDrawlRequestGeneration.panNumber = 'N/A';
    withDrawlRequestGeneration.requestedAt = Number(new Date());
    withDrawlRequestGeneration.tdsType = params.tdsType;
    if (params.tdsType == 'Profit') {
      withDrawlRequestGeneration.currentDepositAmount = 0;
    } else {
      withDrawlRequestGeneration.currentDepositAmount =
        params.currentDepositAmount || 0;
    }
    withDrawlRequestGeneration.processingFees = 0;
    withDrawlRequestGeneration.transferMode = 'ONLINE TRANSFER';
    withDrawlRequestGeneration.transferType = params.withdrawalType;

    await this.pendingCashoutRequestService.create(withDrawlRequestGeneration);
    // admindb.createCashOutRequest(
    //   withDrawlRequestGeneration,
    //   function (err, withdarwalRequestGenerated) {},
    // );
  }

  async pullChipsAffiliate(query) {
    console.log('In pullChipsManagement hit---------', query);
    const params: any = {};
    params.WithdrawAmmount = parseInt(query.amount);
    params.userName = query.userName;
    params.withdrawalType = query.transactionType;
    await this.checkUserData(params);
    await this.checkUserWithdrawlRealChips(params);
    await this.checkUserWithdrawlRakeChips(params);
    await this.calculateUserTDSRealChips(params);
    await this.calculateUserTDSRakeChips(params);
    await this.generateWithdrawlRequestAff(params);
    return params;
    // async.waterfall(
    //   [
    //     async.apply(checkUserData, params),
    //     checkUserWithdrawlRealChips,
    //     checkUserWithdrawlRakeChips,
    //     calculateUserTDSRealChips,
    //     calculateUserTDSRakeChips,
    //     generateWithdrawlRequestAff,
    //   ],
    //   function (err, result) {
    //     if (err) {
    //       console.log('333333333333333333333333 ', err);
    //       return res.json(err);
    //     } else {
    //       return res.json({
    //         success: true,
    //         info: 'WithDrawl Request Generated',
    //         isDisplay: true,
    //         data: params,
    //       });
    //     }
    //   },
    // );
  }

  async searchPlayer(params) {
    const query: any = {};
    query.userName = eval('/^' + params.userName + '$/i');
    const result = await this.userService.findOne(query);
    if (!result) {
      throw new BadRequestException('Unable to find player data');
    }
    return result.toObject();
  }

  async checkUserWithdrawlTransactionPullChips(data) {
    console.log(
      'validate is in transactionByOnlinePayment - ' + JSON.stringify(data),
    );
    const params: any = {};
    params.userName = data.userName;
    params.isTaxable = false;
    params.WithdrawAmmount = parseInt(data.amount);
    await this.checkPlayerData(params);
    await this.checkPlayerWithdrawlCheck(params);
    await this.calculatePlayerTDSZeroHandCheck(params);
    const result = await this.calculatePlayerTDSNoneHandCheck(params);

    return {
      info: result.info,
      isDisplay: true,
      isTaxable: result.isTaxable,
    };
  }

  async pullChipsPlayerByAdmin (data) {
    console.log("inside pullChipsPlayerByAdmin", data);
    
    var params: any = {};
    params.userName = data.userName;
    params.WithdrawAmmount = parseInt(data.amount);
    await this.checkPlayerData(params);
    await this.checkPlayerWithdrawl(params);
    await this.calculatePlayerTDSZeroHand(params);
    await this.calculatePlayerTDSNoneHand(params);
    await this.generateWithdrawlRequest(params);
  }

  async checkPlayerWithdrawl (params) {
    console.log(parseInt(params.WithdrawAmmount), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!', parseInt(params.playerData.realChips));
    if (parseInt(params.WithdrawAmmount) <= parseInt(params.playerData.realChips)) {
      if (params.playerData.chipsManagement.withdrawlCount >= 1000) {
          var lastTransactionDate = new Date(params.playerData.chipsManagement.withdrawlDate).toDateString();
          var todaysDate = new Date().toDateString();
          if (this.convertDateToMidnight(todaysDate) >= this.convertDateToMidnight(lastTransactionDate)) {
              params.playerData.chipsManagement.withdrawlCount = 0;
          } else {
            throw new BadRequestException('Number of withdrawl exausted for today');
          }
      }
      if (params.playerData.statistics.handsPlayedRM > 0) {
        params.claculateTax = true;
        return params
      } else {
        params.claculateTax = false;
        return params;
      }
    } else {
      throw new BadRequestException('Requested Amount is not Allowed');
    }
  }

  async calculatePlayerTDSZeroHand (params) {
    if (!params.claculateTax) {

      if (params.playerData.chipsManagement.withdrawlPercent == 5) {
          params.playerData.chipsManagement.withdrawlPercent = 7;
      } else {
          params.playerData.chipsManagement.withdrawlPercent = 10;
      }
      params.playerData.realChips = params.playerData.realChips - params.WithdrawAmmount;
      params.currentDepositAmount = params.playerData.chipsManagement.deposit;
      params.playerData.chipsManagement.deposit = params.playerData.chipsManagement.deposit - params.WithdrawAmmount;
      params.playerData.chipsManagement.withdrawlCount += 1;
      params.playerData.chipsManagement.withdrawlDate = Number(new Date());
      params.DeductAmount = 0;
      params.processingFees = 0;
      params.effectiveWithdrawlAmount = params.WithdrawAmmount - 0;
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!', params);
      return params;
    } else {
        return params
    }
  }

  async calculatePlayerTDSNoneHand (params) {
    if (params.claculateTax) {
      var tempCalculator = params.WithdrawAmmount - params.playerData.chipsManagement.deposit;
      params.playerData.realChips = params.playerData.realChips - params.WithdrawAmmount;
      params.currentDepositAmount = params.playerData.chipsManagement.deposit;
      params.playerData.chipsManagement.deposit = params.playerData.chipsManagement.deposit - params.WithdrawAmmount;
      if (params.playerData.chipsManagement.deposit >= 0) {
          params.currentDepositAmount = params.WithdrawAmmount;
      }
      params.playerData.chipsManagement.withdrawlCount += 1;
      params.playerData.chipsManagement.withdrawlDate = Number(new Date());
      params.DeductAmount = 0;
      params.processingFees = 0;
      params.effectiveWithdrawlAmount = params.WithdrawAmmount - params.DeductAmount;
      console.log("params=========4111 ", params);
      return params;
    } else {
        return params;
    }
  }

  async generateWithdrawlRequest (params) {
    var query: any = {};
    query.playerId = params.playerId;
    var updateKeys: any = {};
    updateKeys.realChips = params.playerData.realChips;
    if (params.playerData.chipsManagement.deposit < 0) {
        params.playerData.chipsManagement.deposit = 0;
    }
    var chipManagement: any = {};
    chipManagement.deposit = params.playerData.chipsManagement.deposit;
    chipManagement.WithDrawl = 0;
    chipManagement.withdrawlCount = params.playerData.chipsManagement.withdrawlCount;
    chipManagement.withdrawlPercent = params.playerData.chipsManagement.withdrawlPercent;
    chipManagement.withdrawlDate = Number(new Date());
    updateKeys.chipsManagement = chipManagement;
    const updateUser = await this.userService.updateUser(query, { $set: updateKeys });
    console.log("updateUser: ", updateUser);
    if (updateUser) {
      await this.createWithdrawlRequest(params);
    }
  }

  async createWithdrawlRequest (params) {
    // console.log(params);
    var withDrawlRequestGeneration: any = {};
    withDrawlRequestGeneration.requestedAmount = params.WithdrawAmmount;
    withDrawlRequestGeneration.netAmount = params.effectiveWithdrawlAmount;
    withDrawlRequestGeneration.name = "N/A";
    withDrawlRequestGeneration.realName = params.playerData.firstName;
    withDrawlRequestGeneration.userName = params.playerData.userName;
    withDrawlRequestGeneration.emailId = params.playerData.emailId;
    withDrawlRequestGeneration.accountNumber = "N/A";
    withDrawlRequestGeneration.ifcsCode = "N/A";
    withDrawlRequestGeneration.bankName = "N/A";
    withDrawlRequestGeneration.branchName = "N/A";
    withDrawlRequestGeneration.affiliateId = params.playerData.isParentUserName;
    withDrawlRequestGeneration.affiliateMobile = params.affilateMobileNumber;
    withDrawlRequestGeneration.profile = 'PLAYER';
    withDrawlRequestGeneration.accountType = "N/A";
    withDrawlRequestGeneration.referenceNo = this.createUniqueId();
    withDrawlRequestGeneration.panNumber = "N/A";
    withDrawlRequestGeneration.requestedAt = Number(new Date());
    withDrawlRequestGeneration.currentDepositAmount = params.currentDepositAmount || 0;
    withDrawlRequestGeneration.processingFees = 0;
    withDrawlRequestGeneration.transferMode = 'ONLINE TRANSFER';
    withDrawlRequestGeneration.tdsType = 'Real Chips';
    withDrawlRequestGeneration.playerAvailableRealChips = params.playerData.realChips;
    withDrawlRequestGeneration.playerAvailableInstant = params.playerData.instantBonusAmount;
    withDrawlRequestGeneration.playerVipPoints = params.playerData.statistics.megaPoints;
    withDrawlRequestGeneration.tds = 0;
    var createPullChipsPassbookData = {};
    console.log("tds and processingFees deduction is zero");
    createPullChipsPassbookData = {
        playerId: params.playerData.playerId || params.playerId,
        tdsEntry: false,
        processingFeesEntry: false,
        time: Number(new Date()),
        category: "Withdrawl",
        pullChipsPrevAmount: params.playerInitialChips + params.playerData.instantBonusAmount,
        pullChipsNewAmount: params.playerData.realChips + params.playerData.instantBonusAmount,
        pullChipsAmount: params.WithdrawAmmount
    };
    await this.createPullChipsInPassbook(createPullChipsPassbookData);
    var playerDatas: any = {};
    playerDatas.playerId = params.playerData.playerId;
    playerDatas.realChips = params.playerData.realChips + params.playerData.instantBonusAmount;
    this.informPlayer(playerDatas);
    // create pendingCashoutRequest
    const createPendingCashoutRequest = await this.pendingCashoutRequestService.create(withDrawlRequestGeneration);
    console.log("createPendingCashoutRequest: ", createPendingCashoutRequest);
    if (createPendingCashoutRequest) {
      console.log('request generated');
    }
    // admindb.createCashOutRequest(withDrawlRequestGeneration, function (err, withdarwalRequestGenerated) {
    //     console.log('request generated');
    // });
  };

  async createPullChipsInPassbook (data) {
    console.log("Inside createPullChipsInPassbook function");
    if (typeof (data) == "object") {
        if (!Array.isArray(data)) {
            if (data.playerId) {
                var query: any = {};
                query.playerId = data.playerId;
                var insertPassbookDataArray = [];
                var pullChipsData = {
                    time: data.time,
                    category: data.category,
                    prevAmt: data.pullChipsPrevAmount,
                    newAmt: data.pullChipsNewAmount,
                    amount: data.pullChipsAmount,
                    subCategory: "Cashout"
                };
                if (data.tdsEntry === true && data.processingFeesEntry === false) {
                    var tdsData = {
                        time: data.time,
                        category: data.category,
                        prevAmt: data.tdsPrevAmt,
                        newAmt: data.tdsNewAmt,
                        amount: data.tdsAmount,
                        subCategory: "TDS"
                    };
                    insertPassbookDataArray[0] = tdsData;
                    insertPassbookDataArray[1] = pullChipsData;
                } else if (data.tdsEntry === false && data.processingFeesEntry === true) {
                    var processingFeesData = {
                        time: data.time,
                        category: data.category,
                        subCategory: "Processing Fees",
                        prevAmt: data.processingFeesPrevAmt,
                        newAmt: data.processingFeesNewAmt,
                        amount: data.processingFeesAmount
                    };
                    insertPassbookDataArray[0] = processingFeesData;
                    insertPassbookDataArray[1] = pullChipsData;
                } else {
                    insertPassbookDataArray[0] = pullChipsData;
                }
              for (var i = 0; i < insertPassbookDataArray.length; i++) {
                const createPassbook = await this.playerPassbookService.updatePassbok(query, { $push: { "history": insertPassbookDataArray } });
                console.log("createPassbook: ", createPassbook);
                if (createPassbook) {
                  console.log("The Pull chips transaction transaction has been saved in player passbook \n");
                  console.log("result coming from the database -->", createPassbook);
                }
                // admindb.createPassbookEntry(query, insertPassbookDataArray[i], function (err, result) {
                //     if (!err && result) {
                //         console.log("The Pull chips transaction transaction has been saved in player passbook \n");
                //         console.log("result coming from the database -->", result);
                //     } else {
                //         console.log("Error coming while saving the pull chips transaction in player passbook");
                //     }
                // });
                }
            } else {
                console.error("playerId is missing while creating the passbook entry this player");
            }
        } else {
            console.error("The given data in createPullChipsInPassbook function is array");
        }
    } else {
        console.error("The type of given data in createPullChipsInPassbook function is not an 'object'");
    }
  }

  convertDateToMidnight = function (dateToConvert) {
    dateToConvert = new Date(dateToConvert);
    dateToConvert.setHours(0);
    dateToConvert.setMinutes(0);
    dateToConvert.setSeconds(0);
    dateToConvert.setMilliseconds(0);
    return Number(dateToConvert);
  };

  async checkPlayerData(params) {
    console.log('in checkPlayerData ' + JSON.stringify(params));
    const player = await this.userService.findOne({
      userName: eval('/^' + params.userName + '$/i'),
    });
    if (player !== null) {
      params.playerData = player;
      params.playerId = player.playerId;
      params.playerInitialChips = player.realChips;
      if (player.isParentUserName != '') {
        const affilateData: any = await this.affiliateService.findOne({
          userName: player.isParentUserName,
        });

        if (affilateData) {
          params.affilateMobileNumber = affilateData.mobile;
          return params;
        } else {
          throw new BadRequestException('Affilate Data is not Found');
        }
      } else {
        return params;
      }
    } else {
      throw new BadRequestException('Player does not found');
    }
  }

  async checkPlayerWithdrawlCheck(params) {
    if (
      parseInt(params.WithdrawAmmount) <=
        parseInt(params.playerData.realChips) &&
      parseInt(params.WithdrawAmmount) >= 20
    ) {
      if (params.playerData.chipsManagement.withdrawlCount >= 1000) {
        var lastTransactionDate = new Date(
          params.playerData.chipsManagement.withdrawlDate,
        ).toDateString();
        var todaysDate = new Date().toDateString();
        if (todaysDate > lastTransactionDate) {
          params.playerData.chipsManagement.withdrawlCount = 0;
        } else {
          throw new BadRequestException(
            'Number of cashout exhausted for today',
          );
          // return cb({
          //   success: false,
          //   info: 'Number of cashout exhausted for today',
          //   isDisplay: true,
          //   playerChips: params.realChips,
          // });
        }
      }

      if (params.playerData.statistics.handsPlayedRM > 0) {
        params.claculateTax = true;
        return params;
      } else {
        params.claculateTax = false;
        return params;
      }
    } else {
      throw new BadRequestException('Requested Amount is not Allowed');
      // return cb({
      //   success: false,
      //   info: 'Requested Amount is not Allowed',
      //   isDisplay: true,
      //   playerChips: params.realChips,
      // });
    }
  }

  /**
   * This method calculate the TDS on the requested amiunt if player has not played any hands.
   *
   * @method calculatePlayerTDSZeroHandCheck
   */
  async calculatePlayerTDSZeroHandCheck(params) {
    if (!params.claculateTax) {
      var DeductAmount =
        (params.WithdrawAmmount *
          params.playerData.chipsManagement.withdrawlPercent) /
        100;
      DeductAmount = parseInt(DeductAmount as any);
      if (DeductAmount < 100) {
        DeductAmount = 100;
      }
      params.info =
        'You will be charged ' +
        params.playerData.chipsManagement.withdrawlPercent +
        "% of the cash out amount as the cash out processing fees as you don't have  enough magnets.";
      params.playerData.realChips =
        params.playerData.realChips - params.WithdrawAmmount;
      params.playerData.chipsManagement.deposit =
        params.playerData.chipsManagement.deposit - params.WithdrawAmmount;
      params.playerData.chipsManagement.withdrawlCount += 1;
      params.playerData.chipsManagement.withdrawlDate = Number(new Date());
      params.DeductAmount = DeductAmount;
      params.effectiveWithdrawlAmount = params.WithdrawAmmount - DeductAmount;
      params.info +=
        'Amount ' +
        params.effectiveWithdrawlAmount.toString() +
        'Processing Fees ' +
        params.DeductAmount.toString();
      if (params.playerData.chipsManagement.withdrawlPercent == 5) {
        params.playerData.chipsManagement.withdrawlPercent = 7;
      } else {
        params.playerData.chipsManagement.withdrawlPercent = 10;
      }
      return params;
    } else {
      return params;
    }
  }

  /**
   * This method check and calculate the TDS on the requested amount of the player.
   *
   * @method calculatePlayerTDSNoneHandCheck
   */
  async calculatePlayerTDSNoneHandCheck(params: any) {
    if (params.claculateTax) {
      params.info = '';
      console.log(params.playerData);
      if (
        params.playerData.panNumber == '' ||
        (params.playerData.panNumberVerifiedFailed &&
          !params.playerData.panNumberNameSelfVerified)
      ) {
        params.info =
          'Your Current conversion from Magnet chips to real chips is taxable and you have not verified your PAN card details to get tax benefits.';
      } else {
        params.info =
          'Your current conversion from Magnet chips to Real chips is taxable';
        params.claculateTax = false;
      }
      var tempCalculator =
        params.WithdrawAmmount - params.playerData.chipsManagement.deposit;
      params.playerData.realChips =
        params.playerData.realChips - params.WithdrawAmmount;
      params.playerData.chipsManagement.deposit =
        params.playerData.chipsManagement.deposit - params.WithdrawAmmount;
      params.playerData.chipsManagement.withdrawlCount += 1;
      params.playerData.chipsManagement.withdrawlDate = Number(new Date());
      params.DeductAmount = 0;

      params.effectiveWithdrawlAmount =
        params.WithdrawAmmount - params.DeductAmount;
      if (tempCalculator > 0 && tempCalculator >= 10000) {
        params.DeductAmount = (tempCalculator * 30) / 100;
        params.effectiveWithdrawlAmount =
          params.WithdrawAmmount - params.DeductAmount;
        params.info +=
          ' and' +
          ' 30% of ' +
          params.effectiveWithdrawlAmount.toString() +
          ' will be deducted from Your withdrawl Amount as TDS';
        if (params.claculateTax) {
          params.isTaxable = true;
        }
      } else {
        params.info =
          'Your current conversion from Magnet chips to real chips is non- taxable. we recommend you to verify your PAN card to avail the tax benefits against the TDS for future transaction.';
      }
      params.info +=
        'Amount ' +
        params.effectiveWithdrawlAmount.toString() +
        ' Tax ' +
        params.DeductAmount.toString() +
        '   ( 30%  TDS applicable)';
        console.log("params=============================== ", params);
      return params;
    } else {
      return params;
    }
  }

  async checkUserInstantChipsToPull(params) {
    console.log('inside checkUserInstantChipsToPull function', params);
    if (!params.amount || isNaN(params.amount)) {
      throw new BadRequestException(
        'Requested Instant Chips Amount is not Allowed',
      );
    }
    var query: any = {};
    query.userName = eval('/^' + params.userName + '$/i');
    const result = await this.userService.findOne(query);
    if (!!result) {
      if (params.amount > result.instantBonusAmount) {
        throw new BadRequestException(
          'Player does not have enough instant chips!!',
        );
      } else {
        return result;
      }
    } else {
      throw new BadRequestException('Unable to find player data');
    }
  }

  async pullInstantChipsPlayerByAdmin (data) {
    console.log("In pullInstantChipsPlayerByAdmin hit---------", data);
    
    var params: any = {};
    params.userName = data.userName;
    params.WithdrawAmmount = parseInt(data.amount);
    params.pulledBy = data.pulledBy;
    params.pulledByName = data.pulledByName;
    params.reason = data.reason;
    await this.checkPlayerExistence(params);
    await this.updatePlayerInstantChips(params);
    await this.updateBalanceSheet(params);
    await this.createPullInstantChipsHistory(params);
    await this.updatePlayerPassbook(params);
  }

  async checkPlayerExistence (params) {
    console.log("inside checkPlayerExistence function -->", params);
    let query: any = {};
    query.userName = eval('/^' + params.userName + "$/i");
    const user = await this.userService.findOne(query);
    if (user) {
      params.playerData = user;
      return params;
    }
  }

  async updatePlayerInstantChips (params) {
    console.log("Inside updatePlayerInstantChips function", params);
    let query: any = {}, updateQuery: any = {};
    query.userName = params.playerData.userName;
    updateQuery["$inc"] = { instantBonusAmount: -params.WithdrawAmmount };
    const updateInstantChips = await this.userService.updateOne(query, updateQuery);
    
    if (updateInstantChips) {
      const playerDatas: any = {};
      playerDatas.playerId = params.playerData.playerId;
      playerDatas.realChips = params.playerData.realChips + params.playerData.instantBonusAmount - params.WithdrawAmmount;
      this.informPlayer(playerDatas);
      return params;
    } else {
      throw new BadRequestException('unable to pull chips from player');
    }
  }

  async updateBalanceSheet (params) {
    console.log("inside updateBalanceSheet function", params);
    let query = {};
    query["$inc"] = { instantChipsPulled: params.WithdrawAmmount };
    const updateBalanceSheet = await this.balanceSheetService.updateBalanceSheet(query)
    console.log("updateBalanceSheet: ", updateBalanceSheet);
    return params;
    // financedb.updateBalanceSheet(query, function (err, result) {
    //     cb(null, params);
    // })
  }

  async createPullInstantChipsHistory (params) {
    console.log("inside createPullInstantChipsHistory function", params)
    var data: any = {}
    data.pulledAt = Number(new Date());
    data.userName = params.userName;
    data.amount = params.WithdrawAmmount;
    data.pulledBy = params.pulledBy;
    data.pulledByUsername = params.pulledByName;
    if (params.reason) data.reason = params.reason;
    const createInstantChipsPulledHistory = await this.instantChipsPulledHistory.create(data);
    console.log("createInstantChipsPulledHistory: ", createInstantChipsPulledHistory);
    return params;
    // admindb.createInstantChipsPulledHistory(data, function (err, result) {
    //     cb(null, params);
    // })
  }

  async updatePlayerPassbook (params) {
    console.log("inside updatePlayerPassbook", params);
    
    let query: any = {};
    query.playerId = params.playerData.playerId;
    let pullChipsPassbookData = {
      time: Number(new Date()),
      category: "Pull Chips",
      prevAmt: params.playerData.realChips + params.playerData.instantBonusAmount,
      newAmt: (params.playerData.realChips + params.playerData.instantBonusAmount) - params.WithdrawAmmount,
      amount: params.WithdrawAmmount,
      subCategory: "Instant Chips"
    };
    const findPassbook = await this.playerPassbookService.findOne(query)
    console.log("findPassbook: ", findPassbook);
    if (!findPassbook) {
      const dataCreate = {
        playerId: params.playerData.playerId,
        createdAt: new Date(),
        history: [pullChipsPassbookData]
      }
      const createPassbookEntry = await this.playerPassbookService.create(dataCreate);
    } else {
      const createPassbookEntry = await this.playerPassbookService.updatePassbok(query, { $push: { "history": pullChipsPassbookData } });
      console.log("createPassbookEntry: ", createPassbookEntry);
    }
    return params;
    // admindb.createPassbookEntry(query, pullChipsPassbookData, function (err, result) {
    //     console.log("err,result -->", err, result);
    //     cb(null, params);
    // })
  }

  informPlayer (data: any) {
    var playeData = this.cashGamesChangedData(data);
    return this.requestDataService.requestData('POST', '/broadcastToTransferCashoutPayment', { data: playeData, route: 'updateProfile', playerId: data.playerId }).then((response: any) => {
      console.log("response: ", response);

    }).catch(err => {
      console.log(err);
      
    })
  }

  cashGamesChangedData (data) {
    return {
        'updated': {
            'realChips': data.realChips
        },
        'playerId': data.playerId,
        'event': 'REALCHIPSUPDATE'
    };
  };

  countInstantChipsPulledHistory(params) {
    console.log('inside countInstantChipsPulledHistory function', params);
    var query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    return this.instantChipsPulledHistory.count(query);
  }

  listInstantChipsPulledHistory(params) {
    console.log('inside listInstantChipsPulledHistory function', params);
    var query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    const skip = params.skip || 0;
    const limit = params.limit || 0;
    return this.instantChipsPulledHistory
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ pulledAt: -1 });
  }

  async searchPlayerAff(params) {
    var query: any = {};
    query.userName = eval('/^' + params.userName + '$/i');
    const result = await this.userService.findOne(query);
    if (params.loggedInUser == result.isParentUserName) {
      return result;
    } else {
      throw new BadRequestException('Player is not under you.');
    }
  }

  async pullChipsPlayerByAff(params) {
    console.log('In pullChipsManagement hit---------', params);
    await this.checkForParent(params);
    return this.makeRequestForPullChips(params)
  }

  async checkForParent(params) {
    var query: any = {};
    query.userName = eval('/^' + params.userName + '$/i');
    console.log('---------------------------------', params, query);
    const result = await this.userService.findOne(query);
    if (!!result) {
      console.log('the result in check for parent  is ', result);
      if (params.loggedInUser == result.isParentUserName) {
        params.playerId = result.playerId;
        return params;
      } else {
        throw new BadRequestException('The player is not under loggedInUser');
      }
    } else {
      throw new BadRequestException('Unable to find player data');
    }
  }

  /**
   * This method make the request for pull chips of player under affiliate / sub-affiliate. The request
   * is redicrected to game server.
   * @method makeRequestForPullChips
   * @param  {Object}                params [query object]
   * @param  {Function}              cb     [callback as a response]
   */
  async makeRequestForPullChips(params) {
    console.log('----------------------------------------------', params);
    var data: any = {};
    data.realChips = params.amount;
    data.playerId = params.playerId;
    // return this.socketClientService.send('connector.entryHandler.cashOutForPlayerAffilate', data);
    return this.requestDataService.requestData('POST', '/broadcastCashOutForPlayerAffilate', data).then((response: any) => {
      console.log("response: ", response);

    }).catch(err => {
      console.log(err);
      
    })
  }
}
