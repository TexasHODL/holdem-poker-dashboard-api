import { BalanceSheetService } from '@/modules/finance/services/balance-sheet/balance-sheet.service'
import { PassbookData } from '@/modules/player-passbook/entities/player-passbook.entity'
import { PlayerPassbookService } from '@/modules/player-passbook/player-passbook.service'
import { TransactionHistoryService } from '@/modules/transaction-history/services/transaction-history/transaction-history.service'
import { AffiliateService } from '@/modules/user/services/affiliate/affiliate.service'
import { UserService } from '@/modules/user/user.service'
import { MailService } from '@/shared/services/mail/mail.service'
import { SocketClientService } from '@/shared/services/socket-client/socket-client.service'
import { fixedDecimal } from '@/v1/helpers/utils'
import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import shortid from 'shortid32'
import { ChipsTransferHistoryService } from '../chips-transfer-history/chips-transfer-history.service'
import { TransferToAffiliateHistoryService } from '../transfer-to-affiliate-history/transfer-to-affiliate-history.service'
import { TransferToPlayerHistoryService } from '../transfer-to-player-history/transfer-to-player-history.service'
import async = require('async')
import { RequestDataService } from "@/shared/services/request-data/request-data.service"

@Injectable()
export class ChipsTransferService {
  constructor(
    private readonly userService: UserService,
    private readonly playerPassbookService: PlayerPassbookService,
    private readonly socket: SocketClientService,
    private readonly chipsTransferHistoryService: ChipsTransferHistoryService,
    private readonly transferToPlayerHistoryService: TransferToPlayerHistoryService,
    private readonly transferToAffiliateHistoryService: TransferToAffiliateHistoryService,
    private readonly transactionHistoryService: TransactionHistoryService,
    private readonly balanceSheetService: BalanceSheetService,
    private readonly affiliateService: AffiliateService,
    private readonly mail: MailService,
    private readonly requestDataService: RequestDataService
  ) {}

  async transferChips(body) {
    console.log(
      'Inside transferChips handler ---------' + JSON.stringify(body),
    )

    const user = await this.findUser(body)
    await this.addChipsToUser(body)
    await this.addChipsInPlayerDeposit(body)
    await this.deductChipsFromAffiliate(body)
    await this.saveTransferHistoryToPlayer(body)
    await this.saveToFundTransactionHistoryPlayer(body)
    await this.increaseAmountInFinanceDb(body)
    if (body.childEmail) {
      this.sendEmailAdminPlayerChipsTransferNormal(body)
    }
    return user

    // async.waterfall([
    //   async.apply(findUsers, params.body),
    //   addChipsToUser,
    //   addChipsInPlayerDeposit,
    //   saveTransferHistoryToPlayer,
    //   saveToFundTransactionHistoryPlayer,
    //   increaseAmountInFinanceDb,
    //   sendEmailAdminPlayerChipsTransferNormal

    // ], function (err, result) {
    //   if (err) {
    //     return res.json({success: false, result: err});
    //   } else {
    //     result.success = true;
    //     console.log('the final result is ************', JSON.stringify(result));
    //     return res.json({success: true, result: result});
    //   }
    // });
  }

  async findUser (params) {
    console.log("inside findUser ", params);
    const user = await this.userService.findOne({
      userName: params.transferTo,
    })
    if (!user) {
      throw new BadRequestException('No data found for such username')
    }
    if (params.role.name === "affiliate") {
      // if (user.role.name !== "affiliate" || user.role.name !== "subAffiliate") {
      //   throw new BadRequestException('not be allowed');
      // }
      // const checkRoleTranferBy = await this.affiliateService.getAffiliateUser({ userName: user.createdBy })
      const checkRoleTranferBy = await this.affiliateService.getAffiliateUser({ userName: user.isParentUserName })

      if (checkRoleTranferBy[0].role.name === 'affiliate' || checkRoleTranferBy[0].role.name === "subAffiliate") {
        console.log("1");
        
        this.dataTransferChip(params, user)
      } else {
        console.log("2");
        throw new BadRequestException('not be allowed')
      }

    }
    if (params.role.name === "subAffiliate") {
      // if (user.role.name !== "subAffiliate") {
      //   throw new BadRequestException('not be allowed');
      // } 
      // const checkRoleTranferBy = await this.affiliateService.getAffiliateUser({ userName:  user.createdBy })
      const checkRoleTranferBy = await this.affiliateService.getAffiliateUser({ userName: user.isParentUserName })

      if (checkRoleTranferBy[0].role.name === "subAffiliate") {
        this.dataTransferChip(params, user)
      } else {
        throw new BadRequestException('not be allowed')
      }

    }
    if (params.role.name !== "affiliate" || params.role.name !== "subAffiliate") {
      this.dataTransferChip(params, user)
    }
    // if (user.createdBy) {
    //   const checkRoleTranferBy = await this.affiliateService.getAffiliateUser({ userName: params.transferBy });
    //   if (checkRoleTranferBy[0].role.name === 'affiliate') {
    //     if ()
    //   }
    // }
    // params.names = user.firstName;
    // params.childEmail = user.emailId;
    // params.childMobile = user.mobileNumber;
    // params.playerInstantBonus = user.instantBonusAmount;
    // params.playerRealChips = user.realChips;
    // params.playerStartingChips = user.realChips;
    // if (user.playerId) {
    //   params.realPlayerId = user.playerId;
    // }
    // params.transferTo = user.userName;
    // params.megaPointLevel = user.statistics.megaPointLevel;
    // params.megaPoints = user.statistics.megaPoints;
    // if (user.chipsManagement) {
    //   params.playerDepositChips = user.chipsManagement.deposit;
    // }
    return user
    // const filter = {
    //   userName: eval('/^'+ params.transferTo +'$/i')
    // };
    // console.log('Inside findUsers the params is!!!!!!! ', filter);
    // db.findUser(filter, function (err, result) {
    //   if (!err && !!result) {
    //     console.log('the result found in findUsers is!!!!!!!!!', result);
    //     params.names = result.firstName;
    //     params.childEmail = result.emailId;
    //     params.childMobile = result.mobileNumber;
    //     params.playerInstantBonus = result.instantBonusAmount;
    //     params.playerRealChips = result.realChips;
    //     params.playerStartingChips = result.realChips;
    //     if(result.playerId){
    //       params.realPlayerId = result.playerId ;
    //     }
    //     params.transferTo = result.userName;
    //     params.megaPointLevel = result.statistics.megaPointLevel;
    //     params.megaPoints = result.statistics.megaPoints;
    //     if (result.chipsManagement) {
    //       params.playerDepositChips = result.chipsManagement.deposit;
    //     }
    //     cb(null, params);
    //   } else {
    //     console.log('No data found for such username');
    //     cb('No data found for such username');
    //   }
    // });
  }

  dataTransferChip = (params, user: any) => {
    params.names = user.firstName
    params.childEmail = user.emailId
    params.childMobile = user.mobileNumber
    params.playerInstantBonus = user.instantBonusAmount
    params.playerRealChips = user.realChips
    params.playerStartingChips = user.realChips
    if (user.playerId) {
      params.realPlayerId = user.playerId
    }
    params.transferTo = user.userName
    params.megaPointLevel = user.statistics.megaPointLevel
    params.megaPoints = user.statistics.megaPoints
    if (user.chipsManagement) {
      params.playerDepositChips = user.chipsManagement.deposit
    }
  }

  async addChipsToUser(params) {
    console.log('Inside addChipsToUser the params is !!', params)
    const filter = {
      userName: params.transferTo,
    }
    const chips = params.amount
    console.log("chips: ", chips);
    const realChip = params.playerStartingChips;
    console.log("realChip: ", realChip);
    const totalRealChip = chips + realChip
    console.log("totalRealChip: ", totalRealChip);
    // params.playerRealChips = params.playerRealChips + chips

    // check amount of tranferBy
    const checkAmount: any = await this.affiliateService.findAll({ userName: params.transferBy })
    if (checkAmount[0].realChips === 0 || checkAmount[0].realChips < params.amount) {
      throw new BadRequestException('Your number of chips is not enough.')
    }

    const result = await this.userService.addRealChips(filter, chips)
    if (!!result) {
      console.log(
        'the result found !!!!!!!!!!!!!!!!!!!!!!!!in addChipsToUser is-->\n',
        result,
      )
      const userTransferChip = await this.userService.findOne(filter)
      console.log("userTransferChip: ", userTransferChip);
      console.log('now adding this transaction in players passbook')
      const passbookData = {
        // playerId: params.realPlayerId || params.playerId,
        playerId: result.playerId,
        time: Number(new Date()),
        category: 'Deposit',
        prevAmt: params.playerStartingChips + params.playerInstantBonus,
        newAmt: userTransferChip.realChips + params.playerInstantBonus,
        amount: params.amount,
        subCategory: 'Fund Transfer',
      }
      await this.passbookEntry(
        // params.realPlayerId || params.playerId,
        result.playerId,
        passbookData,
      )
      params.playerId = result.playerId
      this.informPlayer({
        playerId: result.playerId,
        playerRealChips: userTransferChip.realChips + params.playerInstantBonus,
      })
    } else {
      console.log('No data found for such username')
      throw new BadRequestException('No data found for such username')
    }
    // console.log('Inside addChipsToUser the params is !!', params);
    // const filter = {
    //   userName: params.transferTo
    // };
    // const chips = params.amount;

    // params.playerRealChips = params.playerRealChips + chips;
    // db.addRealChips(filter, chips, function (err, result) {
    //   if (!err && !!result) {
    //     console.log("the result found !!!!!!!!!!!!!!!!!!!!!!!!in addChipsToUser is-->\n", result);
    //     console.log("now adding this transaction in players passbook");
    //     const passbookData = {
    //       playerId      : params.realPlayerId || params.playerId,
    //         time        : Number(new Date()),
    //         category    : "Deposit",
    //         prevAmt     : params.playerStartingChips + params.playerInstantBonus,
    //         newAmt      : params.playerRealChips + params.playerInstantBonus,
    //         amount      : params.amount,
    //         subCategory : "Fund Transfer"
    //     };
    //     passbookEntry(passbookData);
    //     params.playerId = result.value.playerId;
    //     const broadcastdata = {};
    //     broadcastdata.playerId = result.value.playerId;
    //     broadcastdata.playerRealChips = params.playerRealChips + params.playerInstantBonus;
    //     informPlayer(broadcastdata);
    //     cb(null, params);
    //   } else {
    //     console.log('No data found for such username');
    //     cb('No data found for such username');
    //   }
    // });
  }
  async passbookEntry(playerId, data: PassbookData) {
    console.log("datapassbookEntry ", data)
    console.log("playerIdpassbookEntry ", playerId)
    const book = await this.playerPassbookService.createPassbookEntry(
      {
        playerId,
      },
      data,
    )
    if (book) {
      console.log(
        'The Fund Transfer Transaction has been saved in player passbook \n',
      )
      return book
    }
    throw new HttpException(
      'Error coming while saving the Fund Transfer transaction in player passbook',
      500,
    )
    // console.log("Inside Passbook Entry function");
    // if(data.playerId){
    //   const query = {};
    //   query.playerId = data.playerId;
    //   const dataToBeInserted = {
    //     time        : data.time,
    //     category    : data.category,
    //     prevAmt     : data.prevAmt,
    //     newAmt      : data.newAmt,
    //     amount      : data.amount,
    //     subCategory : data.subCategory
    //   };

    // admindb.createPassbookEntry(query, dataToBeInserted , function (err, result) {
    // if(!err && result){
    //   console.log("The Fund Transfer Transaction has been saved in player passbook \n");
    //   console.log("result coming from the database -->",result);
    // }else{
    //   console.log("Error coming while saving the Fund Transfer transaction in player passbook");
    // }
    // });
    // }else{
    //   console.log("playerId is missing while creating the passbook entry of this player");
    // }
  }

  informPlayer(data) {
    console.log('data in informPlayer is - ' + JSON.stringify(data))
    const playeData = this.cashGamesChangedData(data)
    const dataBroadcast = {
      data: playeData,
      route: 'updateProfile',
      playerId: data.playerId,
    }
    return this.requestDataService.requestData('POST', '/broadcastToTransferChip', dataBroadcast).then((response: any) => {
      if (JSON.parse(response.result).data.success === true) {
        return true
      } else {
        return false
      }
    }).catch(err => {
      console.log(err)
    })
    // this.socket.send('connector.entryHandler.broadcastPlayer', {
    //   data: playeData,
    //   route: 'updateProfile',
    //   playerId: data.playerId,
    // });

    // console.log('data in informPlayer is - ' + JSON.stringify(data));
    // console.log('rootTools.connectorHost - ' + rootTools.connectorHost);
    // pomelo.init({
    //   host: rootTools.connectorHost,
    //   port: rootTools.connectorPort,
    //   log: true
    // }, function () {
    //   const playeData = cashGamesChangedData(data);
    //   console.log('tournament data is - ' + JSON.stringify(playeData));
    //   pomelo.request('connector.entryHandler.broadcastPlayer', {data: playeData, route: 'updateProfile', playerId: data.playerId}, function (err, data) {
    //     console.log('line 301', err, data);
    //     pomelo.disconnect();
    //   });
    // });
  }

  cashGamesChangedData(data) {
    return {
      updated: {
        realChips: data.playerRealChips,
      },
      playerId: data.playerId,
      event: 'REALCHIPSUPDATE',
    }
  }

  async addChipsInPlayerDeposit(params) {
    console.log('Inside addChipsInPlayerDeposit the params is !!', params)
    const filter = {
      userName: params.transferTo,
    }
    const chips = params.amount
    params.playerDepositChips = params.playerDepositChips + chips
    const result = await this.userService.addChipsInPlayerDeposit(
      filter,
      chips,
    )
    console.log('the result found in addChipsInPlayerDeposit is', result)
    return result
  }

  // save all those history of transaction in which amount has been transferred to player either by admin or by affiliate
  async saveTransferHistoryToPlayer(params) {
    console.log('In save saveTransferHistoryToPlayer --- ', params)
    const filter = {
      transferTo: params.transferTo,
      amount: params.amount,
      transferBy: params.transferBy,
      referenceNoAff: shortid.generate().toUpperCase(),
      transactionType: params.transactionType,
      description: params.description ? params.description : 'N/A',
      date: Number(new Date()),
      role: params.role,
      names: params.names,
      userName: params.names,
    }
    params.referenceNoAff = filter.referenceNoAff
    const res =
      await this.transferToPlayerHistoryService.saveTransferChipsPlayerHistory(
        filter,
      )
    if (!res) {
      throw new HttpException(
        'Could not save  transfer to Affiliate History',
        500,
      )
    }
  }

  async saveToFundTransactionHistoryPlayer(params) {
    console.log('In save saveToFundTransactionHistoryPlayer ', params)
    const temp = params.transferTo
    const query = {
      Name: params.transferTo,
      loginId: temp,
      date: Number(new Date()),
      referenceNumber: shortid.generate().toUpperCase(),
      amount: params.amount,
      transferMode: 'FUND TRANSFER',
      paymentId: 'N/A',
      bonusCode: 'N/A',
      bonusAmount: 'N/A',
      approvedBy: params.approvedBy,
      transactionType: params.transactionType,
      names: params.transferTo,
      loginType: temp + '/PLAYER',
      status: 'SUCCESS',
      megaPointLevel: params.megaPointLevel,
      megaPoints: params.megaPoints,
    }
    params.referenceNo = query.referenceNumber
    console.log('The query in saveToFundTransactionHistoryPlayer', query)
    return await this.transactionHistoryService.create(query)
    // admindb.createDepositHistory(query, function (err, result) {
    //   if (!err && !!result) {
    //     console.log('The value of query to save in transaction history is ', query);
    //     console.log('the result found in createDepositHistory in fundTransferManagement is', result);
    //     cb(null, params);
    //   } else {
    //     console.log('Could not save history in fundTransaction History');
    //     cb('Could not save  history in fundTranasaction History');
    //   }
    // });
  }

  increaseAmountInFinanceDb(params) {
    console.log('In increaseAmountInFinanceDb', params)
    return this.balanceSheetService.updateBalanceSheet({
      $inc: { deposit: params.amount },
    })
    // console.log('The amount in increaseAmountInFinanceDb', params.amount);
    // financedb.updateBalanceSheet({ $inc: { deposit: params.amount }}, function (err, result) {
    //   if (!err && !!result) {
    //     console.log('the result found in increaseAmountInFinanceDb in fundTransferManagement is', result);
    //     cb(null, params);
    //   } else {
    //     console.log('Could not increaseAmountInFinanceDb History');
    //     cb('Could not save  increaseAmountInFinanceDb History');
    //   }
    // });
  }

  sendEmailAdminPlayerChipsTransferNormal (params) {
    console.log('In sendEmailAdminPlayerChipsTransfer ', params)
    const content: any = {}
    content.userName = params.names
    content.referenceNo = params.referenceNo
      ? params.referenceNo
      : params.referenceNoAff
    content.amount = fixedDecimal(params.amount, 2)
    content.totalAmount = fixedDecimal(params.playerRealChips, 2)
    return this.mail.sendEmail({
      to: params.childEmail,
      subject: 'FUND TRANSFER',
      content: `<p>Dear ${content.userName},<br>
      <br>
      Your payment referring to (Id -${content.referenceNo}) of $${content.amount} has been received.<br>
      Your total chips balance is ${content.totalAmount}.<br>
      <br>
      Good luck at the tables. <br>
      <br>
      Regards,<br>
      Atlas Poker Team</p>`,
    })
    // sharedModule.sendEmail(mailData, function (result) {
    //   console.log('inside sendEmailAdminPlayerChipsTransfer @@@@', result);
    //   if (result.success) {
    //     cb(null, { success: true, info: 'Email has been sent to Support' });
    //   } else {
    //     cb(null, { success: true, info: "Can't send email" });
    //   }
    // }, function (err) {
    //   cb(null, { success: true, info: "Something went wrong.Can't send email, Please share code with user manually" });
    // });
  }

  async withdrawChips(params) {
    console.log(
      'Inside withdrawChips fundTransferManagement  ---------' +
        JSON.stringify(params),
    )
    await this.doesPlayerExist(params)
    await this.deductChipsFromPlayer(params)
    await this.addAmountToAffiliate(params)
    return await this.savewithDrawHistory(params)
    // async.waterfall([
    //   async.apply(doesPlayerExist, params),
    //   deductChipsFromPlayer,
    //   addAmountToAffiliate,
    //   savewithDrawHistory
    // ], function (err, result) {
    //   if (err) {
    //     return res.json({success: false, result: err});
    //   } else {
    //     result.success = true;
    //     console.log('the final result is ', JSON.stringify(result));
    //     return res.json({success: true, result: result});
    //   }
    // });
  }

  async doesPlayerExist(params) {
    console.log('Inside findUsers the params is ', params)
    const user = await this.userService.findOne({
      userName: params.withdrawFrom,
      isParentUserName: params.affiliate,
    })

    params.userData = user
    if (user.realChips < params.amount) {
      throw new BadRequestException(
        'Player does not have the requested amount of chips',
      )
    }
    return user
  }

  async deductChipsFromPlayer(params) {
    console.log('In deductChipsFromPlayer the params is ', params)
    const res = await this.userService.deductRealChips(
      { userName: params.withdrawFrom },
      params.amount,
    )
    console.log('the result found in deductChipsFromPlayer is', res)
    return res
    // this.userService.deductRealChips(filter, chips, function (err, result) {
    //   if (!err && !!result) {
    //     console.log('the result found in deductChipsFromPlayer is', result);
    //     cb(null, params);
    //   } else {
    //     console.log('Could not deductChips from player account');
    //     cb('Could not deductChips from player account');
    //   }
    // });
  }

  // add valid amount to the affiliate
  addAmountToAffiliate(params) {
    console.log('In addAmountToAffiliate the params is ', params)
    return this.affiliateService.addRealChipstoAffiliate(
      { userName: params.Affiliate },
      params.amount,
    )
    // admindb.addRealChipstoAffiliate(filter, chips, function (err, result) {
    //   if (!err && !!result) {
    //     console.log('the result found in addAmountToAffiliate is', result);
    //     cb(null, params);
    //   } else {
    //     console.log('Could not add chips to Affiliate account');
    //     cb('Could not add chips to  Affiliate account');
    //   }
    // });
  }

  savewithDrawHistory(params) {
    console.log('In save withdraw history the params is ', params)
    const filter = {
      withdrawFrom: params.withdrawFrom,
      amount: params.amount,
      Affiliate: params.Affiliate,
      transactionType: params.transactionType,
      description: params.description,
      date: Number(new Date()),
      userName: params.userName,
    }
    return filter
    // cant not found this function in old source code
    // admindb.saveWithdrawHistory(filter, function (err, result) {
    //   if (!err && !!result) {
    //     console.log('the result found in saveWithdrawHistory is', result);
    //     cb(null, params);
    //   } else {
    //     console.log('Could not save withdraw History');
    //     cb('Could not save withdraw History');
    //   }
    // });
  }

  async transferChipsByAffiliateToPlayer(params) {
    console.log(
      'Inside transferChipsByAffiliateToPlayer fundTransferManagement ---------' +
        JSON.stringify(params.body),
    )
    const user = await this.findUsersUnderAffiliate(params)
    await this.checkValidChipsAffiliate(params)
    await this.addChipsToUser(params)
    await this.addChipsInPlayerDeposit(params)
    await this.deductChipsFromAffiliate(params)
    await this.saveTransferHistoryToPlayer(params)
    if (params.childEmail) {
      await this.sendEmailAdminPlayerChipsTransferNormal(params)
    }
    return user
    // async.waterfall([
    //   async.apply(findUsersUnderAffiliate, params.body),
    //   checkValidChipsAffiliate,
    //   addChipsToUser,
    //   addChipsInPlayerDeposit,
    //   deductChipsFromAffiliate,
    //   saveTransferHistoryToPlayer,
    //   sendEmailAdminPlayerChipsTransferNormal
    // ], function (err, result) {
    //   if (err) {
    //     return res.json({success: false, result: err});
    //   } else {
    //     result.success = true;
    //     console.log('the final result is ', JSON.stringify(result));
    //     return res.json({success: true, result: result});
    //   }
    // });
  }

  async findUsersUnderAffiliate(params) {
    console.log('Inside findUsers the params is ', params)
    const filter = {
      userName: eval('/^' + params.transferTo + '$/i'),
      isParentUserName: params.affiliate,
    }

    const result = await this.userService.findOne(filter)
    if (!result) {
      throw new BadRequestException('Player not found under you!')
    }
    console.log('the result found in findUsersUnderAffiliate is', result)
    params.playerRealChips = result.realChips
    params.playerStartingChips = result.realChips
    params.playerId = result.playerId
    params.transferTo = result.userName
    params.playerInstantBonus = result.instantBonusAmount
    params.names = result.firstName
    params.childEmail = result.emailId
    return result
  }

  // check if the Affiliate has more chips than the amount he is going to transfer
  async checkValidChipsAffiliate(params) {
    console.log('Inside checkValidChipsAffiliate the params is ', params)
    const filter = {
      userName: params.affiliate,
    }
    const result = await this.affiliateService.findOne(filter)
    if (!!result) {
      console.log('the result found in checkValidChipsAffiliate is', result)
      if (result.get('realChips') < params.amount) {
        throw new BadRequestException(
          `You don't have enough chips to transfer`,
        )
      } else {
        console.log(
          'Affiliate has enough chips to transfer to player,going to transfer chips',
        )
      }
    } else {
      throw new BadRequestException('Could not fetch data for the Affiliate')
    }
  }
  // when affiliate transfers chips to player, the transferred amount is deducted from the affiliate account through this function
  deductChipsFromAffiliate(params) {
    console.log('In deductChipsFromAffiliate the params is ', params)
    if (params.role.level <= 0) {
      return this.affiliateService.deductRealChipsFromAffiliateFundTransfer(
        {
          userName: params.transferBy,
        },
        JSON.parse(params.amount),
      )
    }
    // const filter = {
    //   userName: params.Affiliate
    // };
    // const chips = params.amount;
    // admindb.deductRealChipsFromAffiliateFundTransfer(filter, chips, function (err, result) {
    //   if (!err && !!result) {

    //     cb(null, params);
    //   } else {
    //     console.log('Could not deduct chips from Affiliate account');
    //     cb('Could not deduct chips from Affiliate account');
    //   }
    // });
  }

  async withdrawChipsAdmin(params) {
    console.log(
      'Inside withdrawChipsAdmin fundTransferManagement  ---------' +
        JSON.stringify(params),
    )
    await this.isPlayerValid(params)
    await this.deductChipsFromPlayer(params)
    return this.savewithDrawHistory(params)
    // async.waterfall([
    //   async.apply(isPlayerValid, params),
    //   deductChipsFromPlayer,
    //   savewithDrawHistory
    // ], function (err, result) {
    //   if (err) {
    //     return res.json({success: false, result: err});
    //   } else {
    //     result.success = true;
    //     console.log('the final result is ', JSON.stringify(result));
    //     return res.json({success: true, result: result});
    //   }
    // });
  }

  async isPlayerValid(params) {
    console.log('Inside isPlayerValid the params is!!!!!!! ', params)
    const filter = {
      userName: params.withdrawFrom,
    }
    const result = await this.userService.findOne(filter)
    if (!result) {
      throw new BadRequestException('No data found for such username')
    }
    return result
  }

  async transferChipsToAffiliate(params) {
    console.log(
      'Inside transferFundChips Affiliate  ++++++++++' + JSON.stringify(params),
    )
    await this.findAffiliates(params)
    await this.addChipsToAffiliate(params)
    await this.saveTransferHistoryToAffiliate(params)
    await this.saveToFundTransactionHistory(params)
    await this.increaseAmountInFinanceDb(params)
    await this.increaseAmountAffiliateDeposit(params)
    return params
    // async.waterfall([
    //   async.apply(findAffiliates, params.body),
    //   addChipsToAffiliate,
    //   saveTransferHistoryToAffiliate,
    //   saveToFundTransactionHistory,
    //   increaseAmountInFinanceDb,
    //   increaseAmountAffiliateDeposit
    // ], function (err, result) {
    //   if (err) {
    //     return res.json({success: false, result: err});
    //   } else {
    //     result.success = true;
    //     console.log('the final result is ', JSON.stringify(result));
    //     return res.json({success: true, result: result});
    //   }
    // });
  }

  async findAffiliates(params) {
    console.log('Inside findAffiliate the params is ', params)
    const result: any = await this.affiliateService.findOne({
      userName: eval('/^' + params.transferTo + '$/i'),
    })
    if (!!result) {
      console.log('the result found in findAffiliate is', result)
      params.names = result.name
      params.childEmail = result.email
      params.childMobile = result.mobile
      params.loginType = result.role
      params.userType = result.role.name
      params.transferTo = result.userName
      console.log(
        'Transferrring chips to new affiliate or new sub affiliate error',
      )
      if (result.role.name == 'newaffiliate') {
        throw new BadRequestException('You Cannot Transfer Chips to Affiliate')
      }
      if (result.role.name == 'newsubAffiliate') {
        throw new BadRequestException(
          'You Cannot Transfer Chips to Sub Affiliate',
        )
      }
      if (result.role.name == 'subAffiliate') {
        throw new BadRequestException('You cannot transfer chips to Sub-Agent')
      }
      if (result.creditLimit < params.amount) {
        console.log(
          'Transfer amount cannot exceed the credit limit of agent/sub-agent!',
        )
        throw new BadRequestException(
          'Transfer amount cannot exceed the credit limit of Agent/sub-Agent!',
        )
      }
    } else {
      throw new BadRequestException('No Agent found for such username')
    }
    return result
  }

  async addChipsToAffiliate(params) {
    console.log('Inside addChipsToAffiliate the params is ', params)
    const result = await this.affiliateService.addRealChipstoAffiliate(
      { userName: params.transferTo },
      params.amount,
    )
    if (!result) {
      throw new BadRequestException('No data found for such username')
    }
  }

  // save all those entries for which chips has been transferred to affiliate by the admin
  async saveTransferHistoryToAffiliate(params) {
    console.log(
      'In save saveTransferHistoryToAffiliate !!!!!!!!!!!!!!!',
      params,
    )
    const filter = {
      transferTo: params.transferTo,
      amount: params.amount,
      transferBy: params.transferBy,
      transactionType: params.transactionType,
      description: params.description ? params.description : 'N/A',
      date: Number(new Date()),
      role: params.role,
      names: params.names,
      loginType: params.loginType,
      userType: params.userType,
    }
    console.log("filtersaveTransferHistoryToAffiliate ", filter)
    const result =
      await this.transferToAffiliateHistoryService.saveTransferChipsAffiliateHistory(
        filter,
      )
    if (!!result) {
      console.log(
        'the result found in saveTransferHistoryToAffiliate is',
        result,
      )
      return result
    } else {
      throw new HttpException(
        'Could not save transfer to Affiliate History',
        500,
      )
    }
  }

  async saveToFundTransactionHistory(params) {
    console.log('In save saveToFundTransactionHistory---- ', params)
    const temp = params.Name
    let role = ''
    if (
      params.loginType.name == 'affiliate' ||
      params.loginType.name == 'subAffiliate'
    ) {
      console.log('setting the login type of either agent or sub agent')
      if (params.loginType.name == 'affiliate' && params.loginType.name != '') {
        role = params.names + '/' + 'AGENT'
      }
      if (
        params.loginType.name == 'subAffiliate' &&
        params.loginType.name != ''
      ) {
        role = params.names + '/' + 'SUB-AGENT'
      }
    } else {
      console.log('setting the login type of player')
      role = params.names + '/' + params.loginType.name.toUpperCase()
    }
    console.log("-------------+----------", params)
    console.log("-----------------aa-----", role)
    
    
    const query = {
      Name: params.Name,
      loginId: temp,
      date: Number(new Date()),
      referenceNumber: shortid.generate().toUpperCase(),
      amount: params.amount,
      transferMode: 'FUND TRANSFER',
      paymentId: 'N/A',
      bonusCode: 'N/A',
      bonusAmount: 'N/A',
      approvedBy: params.approvedBy,
      transactionType: params.transactionType,
      names: params.names,
      loginType: role,
      status: 'SUCCESS',
    }
    console.log('The query in saveToFundTransactionHistoryPlayer ', query)
    const result = await this.transactionHistoryService.create(query)
    if (!result) {
      throw new BadRequestException(
        'Could not save  history in fundTranasaction History',
      )
    }
    return result
    // admindb.createDepositHistory(query, function (err, result) {
    //   if (!err && !!result) {
    //     console.log('The value of query to save in transaction history is ', query);
    //     console.log('the result found in createDepositHistory in fundTransferManagement is', result);
    //     cb(null, params);
    //   } else {
    //     console.log('Could not save history in fundTransaction History');
    //     cb('Could not save  history in fundTranasaction History');
    //   }
    // });
  }

  async increaseAmountAffiliateDeposit(params) {
    console.log('In increaseAmountAffiliateDeposit', params)
    console.log('The amount in increaseAmountAffiliateDeposit', params.amount)
    const query = {
      userName: params.transferTo,
    }
    const result = await this.affiliateService.updateDeposit(query, {
      $inc: { 'chipsManagement.deposit': params.amount },
    })
    if (!!result) {
      console.log(
        'the result found in increaseAmountAffiliateDeposit in fundTransferManagement is',
        result,
      )
      return result
    } else {
      throw new BadRequestException(
        'Could not save  increaseAmountAffiliateDeposit History',
      )
    }
  }

  async transferChipsByAffiliateToSubAffiliate(params) {
    console.log(
      'Inside transferChipsByAffiliateToSubAffiliate fundTransferManagement ---------' +
        JSON.stringify(params),
    )
    await this.findSubAffiliatesUnderAffiliate(params)
    await this.checkAffiliateHasValidChips(params)
    await this.addChipsToSubAffiliate(params)
    await this.subtractChipsFromAffiliate(params)
    await this.saveTransferHistoryToAffiliate(params)
    return this.addAmountDepositAffiliate(params)
    // async.waterfall([
    //   async.apply(findSubAffiliatesUnderAffiliate, params.body),
    //   checkAffiliateHasValidChips,
    //   addChipsToSubAffiliate,
    //   subtractChipsFromAffiliate,
    //   saveTransferHistoryToAffiliate,
    //   addAmountDepositAffiliate
    // ], function (err, result) {
    //   if (err) {
    //     return res.json({ success: false, result: err });
    //   } else {
    //     result.success = true;
    //     console.log('the final result is ', JSON.stringify(result));
    //     return res.json({ success: true, result: result });
    //   }
    // });
  }

  async findSubAffiliatesUnderAffiliate(params) {
    console.log(
      'Inside findSubAffiliatesUnderAffiliate the params is ',
      params,
    )
    const filter = {
      userName: eval('/^' + params.transferTo + '$/i'),
      parentUser: params.transferBy,
    }
    const result: any = await this.affiliateService.findOne(filter)
    console.log("result==== ", result)
    if (!!result) {
      console.log('the result found in findSubAffiliates is', result)
      params.loginType = result.role
      params.playerRealChips = result.realChips
      params.userType = result.role.name
      params.transferTo = result.userName
      if (result.creditLimit < params.amount) {
        console.error(
          'Transfer amount cannot exceed the credit limit of sub-agent!',
        )
        throw new BadRequestException(
          'Transfer amount cannot exceed the credit limit of Sub-Agent!',
        )
      }
      return result
    } else {
      console.log('Entered Player Does Not Come Under Logged In Affiliate')
      throw new BadRequestException(
        'Entered Player Does Not Come Under Logged In Agent',
      )
    }
  }

  async checkAffiliateHasValidChips(params) {
    console.log('Inside checkAffiliateHasValidChips the params is ', params)
    const filter = {
      userName: params.transferBy,
    }
    const result: any = await this.affiliateService.findOne(filter)
    if (!!result) {
      console.log('the result found in checkValidChipsAffiliate is', result)
      if (result.realChips < params.amount) {
        console.log("You don't have enough chips to transfer")
        throw new BadRequestException(
          "You don't have enough chips to transfer",
        )
      } else {
        console.log(
          'Affiliate has enough chips to transfer to player,going to transfer chips',
        )
        // cb(null, params);
        return result
      }
    } else {
      console.log('Could not fetch data for the Affiliate')
      throw new BadRequestException('Could not fetch data for the Agent')
    }
  }

  async addChipsToSubAffiliate(params) {
    console.log('Inside addChipsToSubAffiliate the params is !!', params)
    const filter = {
      userName: params.transferTo,
    }
    const chips = params.amount
    const result = await this.affiliateService.addRealChipstoAffiliate(
      filter,
      chips,
    )
    if (!!result) {
      console.log('the result found in addChipsToSubAffiliate is', result)
      return result
    } else {
      console.log('No data found for such username--')
      throw new BadRequestException('No data found for such username')
    }
  }

  async subtractChipsFromAffiliate(params) {
    console.log('In subtractChipsFromAffiliate the params is ', params)
    const filter = {
      userName: params.transferBy,
    }
    const chips = params.amount
    const result =
      await this.affiliateService.deductRealChipsFromAffiliateFundTransfer(
        filter,
        chips,
      )
    if (!!result) {
      return result
    } else {
      console.log('Could not deduct chips from Agent account')
      throw new BadRequestException(
        'Could not deduct chips from Agent account',
      )
    }
  }

  // when affiliate transfers chips to subaffiliate then increase the deposit value in affiliate
  async addAmountDepositAffiliate(params) {
    console.log('In addAmountDepositAffiliate', params)
    console.log('The amount in addAmountDepositAffiliate', params.amount)
    const query = {
      userName: params.transferTo,
    }
    const result = await this.affiliateService.updateDeposit(query, {
      $inc: { 'chipsManagement.deposit': params.amount },
    })
    if (!!result) {
      console.log(
        'the result found in addAmountDepositAffiliate in fundTransferManagement is',
        result,
      )
      return result
    } else {
      console.log('Could not addAmountDepositAffiliate ')
      throw new BadRequestException(
        'Could not save  addAmountDepositAffiliate ',
      )
    }
  }
}
