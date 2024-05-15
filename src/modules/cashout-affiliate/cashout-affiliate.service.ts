import { stateOfX } from '@/configs/stateOfX'
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db'
import { PokerDBModel } from '@/database/connections/constants'
import { InjectDBModel } from '@/database/connections/db'
import { parseStringToObjectId } from '@/shared/helpers/mongoose'
import { SmsService } from '@/shared/services/sms/sms.service'
import { SocketClientService } from '@/shared/services/socket-client/socket-client.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { FilterQuery, Model } from 'mongoose'
import { ApproveCashoutRequestService } from '../cashout/services/approve-cashout-request/approve-cashout-request.service'
import { CashoutHistoryService } from '../direct-cashout/services/cashout-history/cashout-history.service'
import { BalanceSheetService } from '../finance/services/balance-sheet/balance-sheet.service'
import { PlayerPassbookService } from '../player-passbook/player-passbook.service'
import _ from 'underscore'
import { app } from '@/configs/app'
import { MailService } from '@/shared/services/mail/mail.service'
import { PendingCashoutRequestService } from '../cashout/services/pending-cashout-request/pending-cashout-request.service'
import { RequestDataService } from '@/shared/services/request-data/request-data.service'
import shortid from "shortid"
import axios from 'axios';

@Injectable()
export class CashoutAffiliateService {
  constructor(
    @InjectAdminModel(AdminDBModel.Affiliates)
    protected readonly model: Model<any>,
    @InjectDBModel(PokerDBModel.User)
    protected readonly user: Model<any>,
    protected readonly pendingCashoutRequestService: PendingCashoutRequestService,
    protected readonly approveCashoutRequestService: ApproveCashoutRequestService,
    protected readonly cashoutHistoryService: CashoutHistoryService,
    protected readonly mailService: MailService,
    protected readonly socketClientService: SocketClientService,
    protected readonly sms: SmsService,
    protected readonly playerPassbookService: PlayerPassbookService,
    protected readonly balanceSheetService: BalanceSheetService,
    protected readonly requestDataService: RequestDataService,
    @InjectAdminModel(AdminDBModel.DirectCashout)
    protected readonly cashoutDirect: Model<any>,
    @InjectAdminModel(AdminDBModel.DirectCashoutHistory)
    protected readonly directCashoutHistory: Model<any>,
    @InjectAdminModel(AdminDBModel.PendingCashOutRequest)
    protected readonly pendingCashOutRequest: Model<any>,
  ) {}

  async checkAffiliateExists(params) {
    var id = params._id
    var query = { userName: eval('/^' + params.userName + '$/i') }
    const data: any = await this.model.findOne(query)
    if (data && id !== data._id.toString()) {
      var count = 0
      var info = ''
      if (data.userName.toUpperCase() === params.userName.toUpperCase()) {
        info += ++count + '. Login Id already exist!! '
      }
      throw new BadRequestException(info)
      // callback({ success: false, info: info });
    }
  }

  async checkSubaffiliateRakeCommission(params) {
    var query: any = {}
    query.parentUser = eval('/^' + params.userName + '$/i')
    query.rakeCommision = { $gte: params.rakeCommision }
    const result = await this.model.count(query)
    if (result == 0) {
      return params
    }
    throw new BadRequestException(
      'Rake Commission% is less than/equal to its Sub-affiliates',
    )
  }

  async checkPlayerRakeBack(params) {
    var query: any = {}
    query.isParentUserName = eval('/^' + params.userName + '$/i')
    query.rakeBack = { $gte: params.rakeCommision }
    const result = await this.user.count(query)
    if (result == 0) {
      return params
    } else if (result > 0) {
      throw new BadRequestException(
        'Rake Commission% is less than/equal to its Players',
      )
    }
  }

  async sendOtpFunction(params) {
    console.log("sendOtpFunction: ", params)
    if (params.mobileNumber) {
      var params2 = {
        mobileNumber: '91' + params.mobileNumber,
        msg: params.msg,
      }
      await this.sms.send(params2)
    }
    // sharedModule.sendOtp(params2, function (otpApiResponse) {
    //   console.log('getting response from otp api');
    //   cb(null, otpApiResponse);
    // });
  }

  async informPlayer (data) {
    console.log("inside informPlayer", data.userName);
    
    const result = await this.user.findOne({
      userName: data.userName,
    })

    data.realChips = result.realChips + result.instantBonusAmount
    data.playerId = result.playerId
    if (result.isMobileNumberVerified) {
      var params: any = {}
      params.mobileNumber = result.mobileNumber
      params.msg =
        'Dear ' +
        data.userName +
        ', cashout request (ID: ' +
        data.referenceNo +
        ") couldn't be completed on " +
        app.GAME_NAME_TEXT +
        '. Check the details & retry.'
      await this.sendOtpFunction(params)
    }
    var playeData = this.cashGamesChangedData(data)
    return this.requestDataService.requestData('POST', '/broadcastToTransferCashoutPayment', { data: playeData, route: 'updateProfile', playerId: data.playerId }).then((response: any) => {
      console.log("response: ", response)

    }).catch((err) => {
      console.log(err)
      
    })
    // await this.socketClientService.send(
    //   'connector.entryHandler.broadcastPlayer',
    //   {
    //     data: playeData,
    //     route: 'updateProfile',
    //     playerId: data.playerId,
    //   },
    // )
  }

  cashGamesChangedData(data) {
    return {
      updated: {
        realChips: data.realChips,
      },
      playerId: data.playerId,
      event: 'REALCHIPSUPDATE',
    }
  }

  async refundRealChips(data) {
    if (data.profile.toUpperCase() === 'PLAYER') {
      const filter: any = {}
      filter.userName = data.userName

      const update: any = {}
      update['$inc'] = {
        realChips: JSON.parse(data.requestedAmount),
        'chipsManagement.deposit': data.currentDepositAmount || data.currentDepositChips,
      }
      const res = await this.user.findOne(filter)
      if (!!res) {
        var playerInfo: any = {}
        playerInfo.playerStartingChips = res.realChips
        playerInfo.playerId = res.playerId
        playerInfo.playerInstantBonus = res.instantBonusAmount
        // db.returnRealChipsToPlayer
        const result = await this.user.updateOne(filter, update)
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ', result)
        await this.informPlayer(data)

        // if (error) {
        //   console.error('Error! while returning realChips to player.');
        // } else {
        console.log(
          'realChips added back to player and now Adding this transaction into player passbook',
        )
        var passbookInfo = {
          tds: data.tds,
          processingFees: data.processingFees,
        }
        var createPassbookData = {}
        var effectiveCashoutAmount = 0
        if (
          passbookInfo.processingFees != 0 &&
          passbookInfo.processingFees > 0
        ) {
          console.log('processing fees is greter than zero')
          effectiveCashoutAmount =
            data.requestedAmount - passbookInfo.processingFees
          createPassbookData = {
            playerId: playerInfo.playerId,
            tdsEntry: false,
            processingFeesEntry: true,
            time: Number(new Date()),
            processingFeesAmount: passbookInfo.processingFees,
            category: 'Withdrawl Rejected',
            processingFeesPrevAmount:
              playerInfo.playerStartingChips + playerInfo.playerInstantBonus,
            processingFeesNewAmount:
              playerInfo.playerStartingChips +
              playerInfo.playerInstantBonus +
              passbookInfo.processingFees,
            processingFeesSubCategory: 'Processing Fees',
            cashoutPrevAmt:
              playerInfo.playerStartingChips +
              playerInfo.playerInstantBonus +
              passbookInfo.processingFees,
            cashoutNewAmt:
              playerInfo.playerStartingChips +
              playerInfo.playerInstantBonus +
              passbookInfo.processingFees +
              effectiveCashoutAmount,
            cashoutAmount: effectiveCashoutAmount,
            cashoutSubCategory: 'Cashout',
          }
        } else if (passbookInfo.tds != 0 && passbookInfo.tds > 0) {
          console.log('tds is greater than zero')
          effectiveCashoutAmount = data.requestedAmount - passbookInfo.tds
          createPassbookData = {
            playerId: playerInfo.playerId,
            tdsEntry: true,
            processingFeesEntry: false,
            time: Number(new Date()),
            tdsAmount: passbookInfo.tds,
            category: 'Withdrawl Rejected',
            tdsPrevAmount:
              playerInfo.playerStartingChips + playerInfo.playerInstantBonus,
            tdsNewAmount:
              playerInfo.playerStartingChips +
              playerInfo.playerInstantBonus +
              passbookInfo.tds,
            tdsSubCategory: 'TDS',
            cashoutPrevAmt:
              playerInfo.playerStartingChips +
              playerInfo.playerInstantBonus +
              passbookInfo.tds,
            cashoutNewAmt:
              playerInfo.playerStartingChips +
              playerInfo.playerInstantBonus +
              passbookInfo.tds +
              effectiveCashoutAmount,
            cashoutAmount: effectiveCashoutAmount,
            cashoutSubCategory: 'Cashout',
          }
        } else {
          console.log('TDS is equal to zero')
          createPassbookData = {
            playerId: playerInfo.playerId,
            tdsEntry: false,
            processingFeesEntry: false,
            time: Number(new Date()),
            category: 'Withdrawl Rejected',
            cashoutPrevAmt:
              playerInfo.playerStartingChips + playerInfo.playerInstantBonus,
            cashoutNewAmt:
              playerInfo.playerStartingChips +
              playerInfo.playerInstantBonus +
              data.requestedAmount,
            cashoutAmount: data.requestedAmount,
            cashoutSubCategory: 'Cashout',
          }
        }
        await this.addWithdrawlRejectEntryInPassbook(createPassbookData)
        // }
      } else {
        console.log("Player Doesn't Exist error coming -->")
      }
    } else {
      var filter: any = {}
      filter.userName = data.userName

      var update = {}
      console.log('@@@@@@@@@###########$$$$$$$$$$$ ', data)
      if (data.tdsType != 'Profit') {
        update['$inc'] = {
          realChips:
            data.requestedAmount /*, 'chipsManagement.deposit': data.currentDepositAmount */,
        }
      } else {
        update['$inc'] = { profit: data.requestedAmount }
      }

      // admindb.returnRealChipstoAffiliate
      const result = await this.model.updateOne(filter, update)
      if (!result) {
        console.error('Error! while returning realChips to affiliate.')
      } else {
        console.log('realChips added back to affiliate.')
      }
    }
  }

  async addWithdrawlRejectEntryInPassbook(data) {
    console.log('Inside addWithdrawlRejectEntryInPassbook function')
    if (typeof data == 'object') {
      if (!Array.isArray(data)) {
        if (data.playerId) {
          var query: any = {}
          query.playerId = data.playerId
          var insertPassbookDataArray = []

          var cashoutData = {
            time: data.time,
            category: data.category,
            prevAmt: data.cashoutPrevAmt,
            newAmt: data.cashoutNewAmt,
            amount: data.cashoutAmount,
            subCategory: data.cashoutSubCategory,
          }

          if (data.tdsEntry === true && data.processingFeesEntry === false) {
            var tdsData = {
              time: data.time,
              category: data.category,
              prevAmt: data.tdsPrevAmount,
              newAmt: data.tdsNewAmount,
              amount: data.tdsAmount,
              subCategory: data.tdsSubCategory,
            }
            insertPassbookDataArray[0] = tdsData
            insertPassbookDataArray[1] = cashoutData
          } else if (
            data.tdsEntry === false &&
            data.processingFeesEntry === true
          ) {
            var processingFeesData = {
              time: data.time,
              category: data.category,
              prevAmt: data.processingFeesPrevAmount,
              newAmt: data.processingFeesNewAmount,
              amount: data.processingFeesAmount,
              subCategory: data.processingFeesSubCategory,
            }
            insertPassbookDataArray[0] = processingFeesData
            insertPassbookDataArray[1] = cashoutData
          } else {
            insertPassbookDataArray[0] = cashoutData
          }

          if (insertPassbookDataArray.length > 1) {
            const result = await this.playerPassbookService.createPassbookEntry(
              query,
              insertPassbookDataArray[0],
            )

            if (result) {
              console.log(
                'The withdrawl Rejected transaction has been saved in player passbook \n',
              )
              console.log('result coming from the database -->', result)
              const result1 =
                await this.playerPassbookService.createPassbookEntry(
                  query,
                  insertPassbookDataArray[1],
                )

              if (result1) {
                console.log('result coming from the database -->', result1)
              }
            } else {
              console.log(
                'Error coming while saving the withdrawl Cancelled transaction in player passbook',
              )
            }
          } else {
            const result = await this.playerPassbookService.createPassbookEntry(
              query,
              insertPassbookDataArray[0],
            )

            if (result) {
              console.log(
                'The withdrawl Rejected transaction has been saved in player passbook \n',
              )
              console.log('result coming from the database -->', result)
            } else {
              console.log(
                'Error coming while saving the withdrawl Cancelled transaction in player passbook',
              )
            }
          }
        } else {
          console.error(
            'playerId is missing while creating the passbook entry this player',
          )
        }
      } else {
        console.error(
          'The given data in addWithdrawlRejectEntryInPassbook function is array',
        )
      }
    } else {
      console.error(
        "The type of given data in addWithdrawlRejectEntryInPassbook function is not an 'object'",
      )
    }
  }

  async insertIntoCashoutHistoryOnTransfer(params) {
    console.log("paramsinsertIntoCashoutHistoryOnTransfer ", params)
    const findQuery: any = {}
    findQuery._id = parseStringToObjectId(params._id)
    findQuery.skip = 0
    findQuery.limit = 0

    const pendingCashoutResult =
      await this.approveCashoutRequestService.listApproveCashOutRequest(
        findQuery,
      )
    
    if (pendingCashoutResult.length > 0) {
      
      delete params._id
      delete params.createdAt
      delete params.updatedAt
      params.createdAt = pendingCashoutResult[0].createdAt
      params.updatedAt = pendingCashoutResult[0].updatedAt
      if (params.status) {
        params.status = params.status
      } else {
        params.status = "Success"
      }
      const result = await this.cashoutHistoryService.insertIntoCashoutHistory(
        params,
      )
      console.log("result==== ", result)
      console.log("params.status === 'Rejected': ", params.status === 'Rejected')
      if (params.status === 'Rejected') {
        console.log("vao 1")
        
        this.refundRealChips(params) // this will refund real chips on player profile
        var content = {
          userName: params.realName,
          referenceNo: params.referenceNo,
          unsuccessfulReason: params.reason,
        }
        if (params.emailId) {
          var mailData = this.createMailData({
            content: content,
            toEmail: params.emailId,
            subject: 'Your cash out request could not be processed',
            template: 'cashoutUnsuccessful',
          })
          const result = await this.mailService.sendMailWithHtmlRejectCashout(mailData)
          console.log('inside sendPasswordMailToPlayer @@@@', result)
          if (result) {
            console.log('Mail sent successfully')
          } else {
            console.log('Mail not sent')
          }
        }
        return {
          success: true,
          result: result,
        }
      } else {
        console.log("vao 2")
        console.log("params.requestedAmount: ", params.requestedAmount)
        console.log("params.tds: ", params.tds)
        const result = await this.balanceSheetService.updateBalanceSheet({
          $inc: {
            withdrawal: params.requestedAmount,
            tds: params.tds,
          },
        })
        console.log("result: ", result)

        if (!!result) {
          console.log(
            'the result found in increaseAmountInFinanceDb in fundTransferManagement is',
            result,
          )
        } else {
          console.log('Could not increaseAmountInFinanceDb History')
        }
        console.log("vao 2")
        
        const content: any = {
          userName: params.realName,
          chips: params.requestedAmount,
          referenceNo: params.referenceNo,
          amount: params.netAmount,
          accountNumber: params.accountNumber,
          tds: params.tds,
        }

        if (params.emailId) {
          console.log("vao 3")
          
          var mailData = this.createMailData({
            content: content,
            toEmail: params.emailId,
            subject: 'You cash out request has been processed',
            template: 'cashoutSuccessful',
          })
          const result1 = await this.mailService.sendMailWithHtml(mailData)
          if (result1) {
            console.log('Mail sent successfully')
          } else {
            console.log('Mail not sent')
          }
        }
        return {
          success: true,
          result: result,
        }
      }
    } else {
      return {
        success: false,
        info: 'This request does not exist any more. Someone already approve/reject this request.',
      }
    }
  }
  getAffiliateCount(query) {
    return this.model.count(query)
  }

  createMailData(params) {
    const mailData: any = {}
    console.log('create mail data params', params)
    // mailData.from = stateOfX.mailMessages.from_email.toString();
    mailData.to = params.toEmail
    mailData.subject = params.subject
    mailData.content = params.content
    mailData.template = params.template
    console.log('mailData is in createMailData - 1' + JSON.stringify(mailData))
    return mailData
  }

  async processApproveCashout(params) {
    console.log("inside processApproveCashout:  ", params)
    var findQuery: any = {}
    findQuery._id = parseStringToObjectId(params._id)
    findQuery.skip = 0
    findQuery.limit = 0

    const pendingCashoutResult =
      await this.pendingCashoutRequestService.listPendingCashOutRequestQuery(
        findQuery,
      )

    if (pendingCashoutResult.length > 0) {
      delete params._id
      params.approvedAt = Number(new Date())
      const result = await this.approveCashoutRequestService.create(params)

      if (params.emailId) {
        await this.mailService.sendMailWithHtml({
          to: params.emailId,
          // from: process.env.FROM_EMAIL,
          subject: 'We have received your Cash out request',
          template: 'cashoutApproved',
          content: {
            userName: params.realName,
            chips: params.requestedAmount,
            referenceNo: params.referenceNo,
          },
        })
      }

      const optparams: any = {}
      optparams.mobileNumber = params.affiliateMobile
      optparams.msg =
        'Dear ' +
        optparams.userName +
        ', ' +
        app.GAME_NAME_TEXT +
        ' has received your cashout request of INR ' +
        optparams.netAmount +
        ' (ID: ' +
        optparams.referenceNo +
        '). It will be processed within 2-3 business days.'
      return await this.sendOtpFunction(optparams)
    } else {
      throw new BadRequestException(
        'This request does not exist any more. Someone already approve/reject this request.',
      )
    }
  }

  async removeCashoutRequestOnAction(params) {
    console.log("removeCashoutRequestOnAction: ", params)
    var requestId = params._id
    const getUserByPCRS: any = await this.pendingCashoutRequestService.findOne(parseStringToObjectId(requestId))
    // const getAff: any = await this.model.findOne({ userName: getUserByPCRS.userName });
    // const getUser: any = await this.user.findOne({ userName: getUserByPCRS.userName })
    // const userData = getAff ? getAff : getUser
    // console.log("userName: ", userData);
    // var realChips = userData.realChips + getUserByPCRS.requestedAmount
    // var givebackChip = await this.model.updateOne({ userName: userData.userName }, { realChips: realChips })
    return await this.pendingCashoutRequestService.remove(
      parseStringToObjectId(requestId),
    )
    // admindb.removeCashoutRequestOnAction(requestId, function (err, result) {
    //   if (err) {
    //     return res.json(err);
    //   } else {
    //     return res.json({ success: true, result: result });
    //   }
    // });
  }

  async removeFromCashsoutApprovel(params) {
    var requestId = params._id
    return await this.approveCashoutRequestService.remove(
      parseStringToObjectId(requestId),
    )
  }

  async getCashoutHistoryCount(params) {
    return this.cashoutHistoryService.getCashoutHistoryCount(params)
  }

  async getCashoutHistoryList(params) {
    console.log('Inside getCashoutHistoryList function', params)
    const result = await this.cashoutHistoryService.listCashOutHistory(params)
    params.cashoutHistoryResult = result
  }

  async calculateTotalApprovedAmount(params) {
    console.log('Inside calculateTotalApprovedAmount function', params)
    const query: any = {}
    if (
      params.status &&
      (params.status == 'Cancelled' || params.status == 'Rejected')
    ) {
      params.totalApprovedAmount = 0
      return params
    } else {
      if (params.userName) {
        query.userName = eval('/^' + params.userName + '$/i')
      }
      if (params.referenceNo) {
        query.referenceNo = params.referenceNo
      }
      if (params.bankTransactionId) {
        console.log('here in transactionId')
        query.transactionId = params.bankTransactionId.toString()
      }
      if (params.createdAt) {
        query.createdAt = params.createdAt
      }
      query.status = eval('/^' + 'Success' + '$/i')
      console.log('calculateTotalApprovedAmount query', query)
      const result = await this.cashoutHistoryService.calculateTotalApprovedAmount(query)
      if (result.length > 0) {
        params.totalApprovedAmount = result[0].amount
      } else {
        params.totalApprovedAmount = 0
      }
      return params
    }
  }

  async listCashOutHistory(params) {
    console.log('listCashOutHistory', JSON.stringify(params))
    await this.getCashoutHistoryList(params)
    const result = await this.calculateTotalApprovedAmount(params)
    console.log("result==== ", result.cashoutHistoryResult)
    return {
      success: true,
      result: result.cashoutHistoryResult,
      approvedAmount: result.totalApprovedAmount,
    }
  }

  async insertIntoCashoutHistory (params) {
    console.log("inside insertIntoCashoutHistory", params);
    
    const findQuery: any = {}
    findQuery._id = parseStringToObjectId(params._id)
    findQuery.skip = 0
    findQuery.limit = 0

    const pendingCashoutResult =
      await this.pendingCashoutRequestService.listPendingCashOutRequestQuery( 
        findQuery,
      )
    
      if (pendingCashoutResult.length > 0) {
      
        delete params._id
        delete params.createdAt
        delete params.updatedAt
        params.createdAt = pendingCashoutResult[0].createdAt
        params.updatedAt = pendingCashoutResult[0].updatedAt
        params.status = "Rejected"
        const result = await this.cashoutHistoryService.insertIntoCashoutHistory(
          params,
        )
        if (params.status === 'Rejected') {
          console.log("vao 1")
          this.refundRealChips(params) // this will refund real chips on player profile
          
          var content = {
            userName: params.userName,
            referenceNo: params.referenceNo,
            unsuccessfulReason: params.reason || "",
          }
          console.log("content: ", content);
          if (params.emailId) {
            var mailData = this.createMailData({
              content: content,
              toEmail: params.emailId,
              subject: 'Cash out from Texas was unsuccessful',
              template: 'cashoutRejected',
            })
            const result = await this.mailService.sendMailWithHtmlRejectCashout(mailData)
            console.log('inside sendPasswordMailToPlayer @@@@ ', result)
            if (result) {
              console.log('Mail sent successfully')
            } else {
              console.log('Mail not sent')
            }
          }
          return {
            success: true,
            result: result,
          }
        } 
      } else {
        return {
          success: false,
          info: 'This request does not exist any more. Someone already approve/reject this request.',
        }
      }
  }

  async createAffilateWithDrawlRequest (params) {
    console.log("inside createAffilateWithDrawlRequest")
    params.WithdrawAmmount = parseInt(params.requestedAmount)
    await this.checkUserData(params)
    await this.checkUserWithdrawlRealChips(params)
    await this.checkUserWithdrawlRakeChips(params)
    await this.calculateUserTDSRealChips(params)
    await this.calculateUserTDSRakeChips(params)
    await this.generateWithdrawlRequest(params)

    return params
  }

  async checkUserData (params) {
    console.log("inside checkUserData", params)
    const user = await this.model.find({ userName: params.affiliateId })
    params.userData = user[0]
    return params
  } 

  async checkUserWithdrawlRealChips (params) {
    console.log("inside checkUserWithdrawlRealChips", params)
    if (params.withdrawalType != 'realChips') {
      return params
    }
    if (parseInt(params.WithdrawAmmount) != 0 && parseInt(params.WithdrawAmmount) <= parseInt(params.userData.realChips)) {
      
      if (params.userData.chipsManagement.withdrawlCount >= 11111115) {
        var lastTransactionDate = new Date(params.userData.chipsManagement.withdrawlDate).toDateString()
        var todaysDate = new Date().toDateString()
        if (todaysDate > lastTransactionDate) {
          params.userData.chipsManagement.withdrawlCount = 0
        } else {
          return ({ success: false, info: 'Number of withdrawl exausted for today', isDisplay: true })
        }
      }
      return params
    } else {
      throw new BadRequestException('Requested Amount is not Alloweded');
      return ({ success: false, info: 'Requested Amount is not Alloweded', isDisplay: true })
    }
  }

  async checkUserWithdrawlRakeChips (params) {
    console.log("inside calculateUserTDSRealChips", params)
    
    if (params.withdrawalType != 'rakeAmount') {
      return params
    }
    if (parseInt(params.WithdrawAmmount) != 0 && (parseInt(params.WithdrawAmmount) <= parseInt(params.userData.profit))) {
      if (params.userData.chipsManagement.profitCount >= 1111112) {
        var lastTransactionDate = new Date(params.userData.chipsManagement.profitWithdrawlDate).toDateString()
        var todaysDate = new Date().toDateString()
        console.log('#@#@#@#@#@#@#@#@#@@#@', todaysDate > lastTransactionDate)
        if (todaysDate > lastTransactionDate) {
          params.userData.chipsManagement.profitCount = 0
        } else {
          // return ({ success: false, info: 'Number of withdrawl exausted for today', isDisplay: true })
          throw new BadRequestException('Number of withdrawl exausted for today');
        }
      }
      return params
    } else {
      // return ({ success: false, info: 'Requested Amount is not Alloweded', isDisplay: true })
      throw new BadRequestException('Requested Amount is not Alloweded');
    }
  }

  async calculateUserTDSRealChips (params) {
    console.log("inside calculateUserTDSRealChips", params)
    if (params.withdrawalType != 'realChips') {
      return params
    }
  
    console.log('!!!!!!!!!@@@@@@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!', params)
  
    params.userData.realChips = params.userData.realChips - params.WithdrawAmmount
    params.currentDepositAmount = params.userData.chipsManagement.deposit
    if (params.userData.chipsManagement.deposit >= 0) {
      params.currentDepositAmount = params.WithdrawAmmount
    }
    params.userData.chipsManagement.withdrawlCount += 1
    params.userData.chipsManagement.withdrawlDate = Number(new Date())
    params.DeductAmount = 0
    params.processingFees = 0
    params.effectiveWithdrawlAmount = params.WithdrawAmmount - params.DeductAmount
    params.tdsType = 'Real Chips'
    return params
  }

  async calculateUserTDSRakeChips (params) {
    console.log("inside calculateUserTDSRakeChips", params)
    if (params.withdrawalType != 'rakeAmount') {
      return params
    }
    console.log("-------------------------", params)
    
    params.userData.profit = params.userData.profit - params.WithdrawAmmount
    params.currentDepositAmount = params.userData.chipsManagement.deposit
    params.userData.chipsManagement.profitCount += 1
    params.userData.chipsManagement.profitWithdrawlDate = Number(new Date())
    params.DeductAmount = 0
    params.processingFees = 0
    params.effectiveWithdrawlAmount = params.WithdrawAmmount - 0
    params.tdsType = 'Profit'
    return params
  }

  async generateWithdrawlRequest (params) {
    console.log("inside generateWithdrawlRequest", params)
    var query: any = {}
    query.userName = params.userData.userName
    var updateKeys: any = {}
    updateKeys.realChips = params.userData.realChips
    updateKeys.profit = params.userData.profit
    if (params.userData.chipsManagement.deposit < 0) {
      params.userData.chipsManagement.deposit = 0
    }
    var chipManagement: any = {}
    chipManagement.deposit = params.userData.chipsManagement.deposit
    chipManagement.WithDrawl = 0
    chipManagement.withdrawlCount = params.userData.chipsManagement.withdrawlCount
    chipManagement.profitCount = params.userData.chipsManagement.profitCount
    chipManagement.withdrawlPercent = params.userData.chipsManagement.withdrawlPercent || 5
    chipManagement.withdrawlDate = params.userData.chipsManagement.withdrawlDate
    chipManagement.profitWithdrawlDate = params.userData.chipsManagement.profitWithdrawlDate
    updateKeys.chipsManagement = chipManagement
    const updateteAffiliateCashout = await this.model.findOneAndUpdate(query, { $set: updateKeys }, { new: true })
    if (updateteAffiliateCashout) {
      await this.createWithdrawlRequest(params)
    }
  }

  async createWithdrawlRequest (params) {
    console.log("inside createWithdrawlRequest", params)
    var withDrawlRequestGeneration: any = {}
    withDrawlRequestGeneration.requestedAmount = params.WithdrawAmmount
    withDrawlRequestGeneration.netAmount = params.effectiveWithdrawlAmount || params.netAmount
    withDrawlRequestGeneration.name = params.name || params.userData.name
    withDrawlRequestGeneration.accountNumber = params.accountNumber
    withDrawlRequestGeneration.ifcsCode = params.ifcsCode
    withDrawlRequestGeneration.tds = 0
    withDrawlRequestGeneration.processingFees = 0
    withDrawlRequestGeneration.bankName = params.bankName
    withDrawlRequestGeneration.branchName = params.branchName
    withDrawlRequestGeneration.accountType = params.accountType
    withDrawlRequestGeneration.mobile = params.userData.mobile
    withDrawlRequestGeneration.tdsType = params.tdsType
    if (params.roleName != "newsubAffiliate") {

      withDrawlRequestGeneration.affiliateId = 'N/A'
      if (params.profile != "AGENT") {
        withDrawlRequestGeneration.profile = 'AFFILIATE'
      } else {
        withDrawlRequestGeneration.profile = params.profile
      }

    } else if (params.roleName == "newsubAffiliate") {
      withDrawlRequestGeneration.profile = 'Sub-Affiliate'
      withDrawlRequestGeneration.affiliateId = params.userData.parentUser
    }
    withDrawlRequestGeneration.affiliateMobile = params.userData.mobile
    withDrawlRequestGeneration.realName = params.userData.name
    withDrawlRequestGeneration.userName = params.userData.userName
    withDrawlRequestGeneration.referenceNo = this.createUniqueId()
    withDrawlRequestGeneration.requestedAt = Number(new Date())
    if (params.tdsType == 'Profit') {
      withDrawlRequestGeneration.currentDepositAmount = 0
    } else {
      withDrawlRequestGeneration.currentDepositAmount = params.currentDepositAmount || 0
    }
    withDrawlRequestGeneration.transferMode = 'ONLINE TRANSFER'
    withDrawlRequestGeneration.transferType = params.withdrawalType

    console.log("withDrawlRequestGeneration: ", withDrawlRequestGeneration)
    const createCashOutRequest = await this.pendingCashOutRequest.create(withDrawlRequestGeneration)

    params.pendingCashoutId = createCashOutRequest._id;
    params.netAmount = params.effectiveWithdrawlAmount || params.netAmount;
    params.referenceNo = this.createUniqueId()

    return params;
  }

  createUniqueId = function () {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  async approveDataForCashout (params) {
    console.log("inside approveDataForCashout", params)
    await this.checkIfRequestExists(params)
    await this.addChipsToAffiliateSubAffiliate(params)
    await this.insertDataInDirectCashoutHistory(params)
    await this.deleteDataAfterAction(params)
    await this.sendMailandApprovalMessageToPlayer(params)
    await this.sendMsgToPlayer(params)

    return params
  }

  async rejectDataForCashout (params) {
    console.log("inside rejectDataForCashout", params)
    await this.checkIfRequestExists(params)
    await this.addChipsToPlayer(params)
    await this.insertDataInDirectCashoutHistory(params)
    await this.deleteDataAfterAction(params)
    await this.sendRejectionMailToPlayer(params)
    await this.sendMsgToPlayer(params)
    console.log("params: ", params)

    return params
  }

  async checkIfRequestExists (params) {
    console.log("inside checkIfRequestExists", params)
    var filter = {
      _id: parseStringToObjectId(params.tempReqId)
    }
    const checkCashoutRequestExists = await this.cashoutDirect.findOne(filter)
    if (checkCashoutRequestExists) {
      const dataResult = {
        name: checkCashoutRequestExists.name,
        userName: checkCashoutRequestExists.userName,
        playerId: checkCashoutRequestExists.playerId,
        profile: checkCashoutRequestExists.profile,
        currentDepositChips: checkCashoutRequestExists.currentDepositChips,
        amount: checkCashoutRequestExists.amount,
        type: checkCashoutRequestExists.type,
        affilateId: checkCashoutRequestExists.affilateId,
        createdAt: checkCashoutRequestExists.createdAt
      }
      params.result = dataResult
      return params
    } else {
      return params
    }
  }

  async addChipsToAffiliateSubAffiliate (params) {
    console.log("inside addChipsToAffiliateSubAffiliate", params)
    var filter: any = {}
    var chips 
    if(params.result.affilateId){
      filter.userName = params.result.affilateId 
      chips = params.result.amount
    }
    if(params.result.affiliateId){
      filter.userName = params.result.affiliateId
      chips = params.result.requestedAmount
    }
    params.result.actionTakenAt = Number(new Date())
    params.result.status = 'Approved'
    params.result.referenceNumber = shortid.generate().toUpperCase()
    console.log("processed params--", params, filter, chips)
    if (params.result.type != 'Profit Chips') {
      const addRealChipstoAffiliateCashout = await this.model.update(filter, { $inc: { realChips: chips, 'withdrawal': chips } })
      if (addRealChipstoAffiliateCashout) {
        console.log('the result found in addRealChipstoAffiliateCashout is', addRealChipstoAffiliateCashout)
        return params
      }
    } else {
      const addProfitChipsToAffiliate = await this.model.update(filter, { $inc: { profit: chips } })
      if (addProfitChipsToAffiliate) {
        console.log('the result found in addRealChipstoAffiliateCashout is', addProfitChipsToAffiliate)
        return params
      }
    }
  }

  async insertDataInDirectCashoutHistory (params) {
    console.log('inside insertDataInDirectCashoutHistory the params is', params)
    params.result.referenceNumber = params.result.referenceNo || params.result.referenceNumber
    const filter = params.result
    const insertInDirectCashoutHistory = await this.directCashoutHistory.create(filter)
    if (insertInDirectCashoutHistory) {
      console.log('the result found in insertDataInDirectCashoutHistory is', insertInDirectCashoutHistory)
      return params
    }
  }

  async deleteDataAfterAction (params) {
    console.log("inside deleteDataAfterAction", params)
    console.log('Inside deleteDataAfterAction the params is !!', params)
    var filter = {
      _id: parseStringToObjectId(params.tempReqId)
    }
    var chips = params.amount
    
    const deleteCashoutData = await this.cashoutDirect.deleteOne(filter)
    if (deleteCashoutData) {
      console.log('the result found in addRealChipstoPlayerCashout is', deleteCashoutData)
      return params
    }
  }

  async sendMailandApprovalMessageToPlayer (params) {
    console.log("inside sendMailandApprovalMessageToPlayer function")
    if (params.result.profile == "PLAYER") {
      console.log("finding the player From db")
      const findUser = await this.user.findOne({ userName: params.result.userName, isParentUserName: params.result.affiliateId })
      if (findUser) {
        var msgData: any = {}
        msgData.mobileNumber = findUser.mobileNumber
        msgData.msg = 'Dear ' + findUser.userName + ', your cashout request of ' + params.result.requestedAmount + ' chips was ' + params.result.status + ' by your agent(' + params.result.affiliateId + '). Please contact your agent for balance adjustment.' + 'Texas Holdl'
        // await this.sendOtpFunction(msgData);
        var mailData: any = {
          to: params.result.emailId || params.playerEmail,
          from: process.env.FROM_EMAIL,
          subject: msgData.msg,
          template: 'cashoutRejected',
          userName: params.result.realName || params.result.userName,
          transactionid: params.result.referenceNo
        }
        const result = await this.mailService.sendMailWithHtml(mailData)
          console.log('inside sendPasswordMailToPlayer @@@@', result)
        if (result) {
          console.log('Mail sent successfully')
        } else {
          console.log('Mail not sent')
        }
        return params
      }
    }
  }

  async sendMsgToPlayer (params) {
    console.log("\n\n\n\n------------------line1156", params)
    console.log("!!@@@@@!!!!!!!!!!!! params--->", params)
    const findUser = await this.user.findOne({ playerId: params.result.playerId })
    if (findUser) {
      var msgData: any = {}
      msgData.mobileNumber = findUser.mobileNumber 
      msgData.msg = 'Dear ' + findUser.userName + ', your cashout request of ' + params.amount +' chips was '+params.result.status+' by your agent('+ params.result.affilateId +'). Please contact your agent for balance adjustment.'+ 'Texas Holdl'
      // await this.sendOtpFunction(msgData);
      var mailData: any = {
        to: params.result.emailId || params.playerEmail,
        from: process.env.FROM_EMAIL,
        subject: msgData.msg,
        template: 'cashoutRejected',
        userName: params.result.realName || params.result.userName,
        transactionid: params.result.referenceNo
      }
      const result = await this.mailService.sendMailWithHtml(mailData)
      console.log('inside sendPasswordMailToPlayer @@@@', result)
      if (result) {
        console.log('Mail sent successfully')
        return params.success = true
      } else {
        console.log('Mail not sent')
        return params.success = false
      }
    }
    return params
  }

  async addChipsToPlayer (params) {
    console.log('Inside addChipsToPlayer the params is !!', params)
    if (params.result.profile.toUpperCase() == 'PLAYER') {
      var filter = {
        userName: params.result.userName
      }
      var chips = params.amount
      params.result.actionTakenAt = Number(new Date())
      params.result.status = 'Rejected'
      params.result.referenceNo = shortid.generate().toUpperCase()
      params.actionTakenAt = Number(new Date())
      console.log("params========================== ", params)

      const findUser = await this.user.findOne(filter)

      if (findUser) {
        params.result.playerId = findUser.playerId
        params.result.playerInitialChips = findUser.realChips
        params.result.playerInstantBonus = findUser.instantBonusAmount

        const addRealChipstoPlayerCashout = await this.user.findOneAndUpdate(filter, { $inc: { realChips: chips, 'chipsManagement.deposit': chips } }, { returnOriginal: false })

        console.log('the result found in addRealChipstoPlayerCashout is', addRealChipstoPlayerCashout)
        if (addRealChipstoPlayerCashout) {
          var createPassbookData = {}
          var effectiveCashoutAmount = 0
          if(params.result.processingFees && params.result.processingFees !=0 && params.result.processingFees >0){
            console.log("Processing Fees is present and Processing Fees value is not zero")
            effectiveCashoutAmount = params.amount - params.result.processingFees
            createPassbookData = {
              playerId                  : params.result.playerId,
              tdsEntry                  : false,
              processingFeesEntry       : true,
              time                      : Number(new Date()),
              category                  : "Withdrawl Rejected",
              processingFeesPrevAmount  :  params.result.playerInitialChips + params.result.playerInstantBonus,
              processingFeesNewAmount   :  params.result.playerInitialChips + params.result.playerInstantBonus + params.result.processingFees,
              processingFeesAmount      :  params.result.processingFees,
              processingFeesSubCategory : "Processing Fees",
              cashoutPrevAmt            : params.result.playerInitialChips + params.result.playerInstantBonus + params.result.processingFees,
              cashoutNewAmt             : params.result.playerInitialChips + params.result.playerInstantBonus + params.result.processingFees + effectiveCashoutAmount,
              cashoutAmount             : effectiveCashoutAmount, 
              cashoutSubCategory        : "Cashout" 
            }
          }else if(params.result.tds && params.result.tds !=0 && params.result.tds >0){
            console.log("tds is present and tds value is not zero")
            effectiveCashoutAmount = params.amount - params.result.tds
            createPassbookData = {
              playerId           : params.result.playerId,
              tdsEntry           : true,
              processingFeesEntry: false,
              time               : Number(new Date()),
              category           : "Withdrawl Rejected",
              tdsPrevAmount      :  params.result.playerInitialChips + params.result.playerInstantBonus,
              tdsNewAmount       :  params.result.playerInitialChips + params.result.playerInstantBonus + params.result.tds,
              tdsAmount          :  params.result.tds,
              tdsSubCategory     : "TDS",
              cashoutPrevAmt     : params.result.playerInitialChips + params.result.playerInstantBonus + params.result.tds,
              cashoutNewAmt      : params.result.playerInitialChips + params.result.playerInstantBonus + params.result.tds + effectiveCashoutAmount,
              cashoutAmount      : effectiveCashoutAmount, 
              cashoutSubCategory : "Cashout" 
            }

          }else {
            console.log("Either tds is not present in the params or tds value is zero")
            createPassbookData = {
              playerId           : params.result.playerId,
              tdsEntry           : false,
              processingFeesEntry: false,            
              time               : Number(new Date()),
              category           : "Withdrawl Rejected",
              cashoutSubCategory : "Cashout",
              cashoutPrevAmt     : params.result.playerInitialChips + params.result.playerInstantBonus,
              cashoutNewAmt      : params.result.playerInitialChips + params.result.playerInstantBonus + params.amount,
              cashoutAmount      : params.amount,
            }
          }
          await this.addWithdrawlRejectEntryInPassbook(createPassbookData)
          var playerDatas: any = {}
          playerDatas.playerId = params.result.playerId
          playerDatas.realChips = addRealChipstoPlayerCashout.realChips + addRealChipstoPlayerCashout.instantBonusAmount
          params.playerEmail = addRealChipstoPlayerCashout.emailId
          await this.informPlayer(playerDatas)
          return params
        } else {
          console.log('unable to refund real chips into the player account')
          return ({ success: false, info: 'unable to refund real chips into the player account' })
        }
      } else {
        console.log('No data found for such username')
        return ({ success: false, info: 'No player found for such username' })
      }
    } else {
      console.log('Request made by subAffiliate---------', params)
      var filter = {
        userName: params.result.userName
      }
      var chips = params.amount
      params.result.actionTakenAt = Number(new Date())
      params.result.status = 'Rejected'
      params.result.referenceNumber = shortid.generate().toUpperCase()
      if (params.result.type != 'Profit Chips') {
        const addRealChipstoSubAffiliateCashout = await this.model.update(filter, { $inc: { realChips: chips } })
        if (addRealChipstoSubAffiliateCashout) {
          return params
        } else {
          console.log('No data found for such username--')
          return ({ success: false, info: 'No data found for such username' })
        }
      } else {
        const addProfitChipsToAffiliate = await this.model.update(filter, { $inc: { profit: chips } })
        if (addProfitChipsToAffiliate) {
          return params
        } else {
          console.log('No data found for such username--')
          return ({ success: false, info: 'No data found for such username' })
        }
      }
    }
  };

  async sendRejectionMailToPlayer (params) {
    console.log("inside sendRejectionMailToPlayer function")
    if(params.result.profile.toUpperCase() == "PLAYER"){
    var mailData: any = {
        to: params.result.emailId || params.playerEmail,
        from: process.env.FROM_EMAIL,
        subject: 'Cash out from '+ ' C4 Poker'+ ' was unsuccessful',
        template: 'cashoutRejected',
        userName: params.result.realName || params.result.userName,
        transactionid: params.result.referenceNo
      }
      const result = await this.mailService.sendMailWithHtml(mailData)
      console.log('inside sendPasswordMailToPlayer @@@@', result)
      if (result) {
        console.log('Mail sent successfully')
      } else {
        console.log('Mail not sent')
      }
      // sharedModule.sendMailWithHtml(mailData, function (result) {
      //   console.log('inside sendRejectionMailToPlayer @@@@', result);
      //   if (result.success) {
      //     cb(null, params);
      //     console.log("here mail sent successfully");
      //   } else {
      //     console.log("mail not sent");
      //     cb("Cashout rejection mail to the player has not sent !!")
      //   }
      // });
    } else {
      // cb(null,params);
      return params
    }
  }

  async genarateProcessApproveCashout (params) {
    console.log("inside genarateProcessApproveCashout", params);
    var findQuery: any = {};
    findQuery._id = parseStringToObjectId(params.pendingCashoutId);

    const pendingCashoutResult =
      await this.pendingCashoutRequestService.listPendingCashOutRequestQuery(
        findQuery,
      )
    if (pendingCashoutResult.length > 0) {
      params.approvedAt = Number(new Date())
      const result = await this.approveCashoutRequestService.create(params);

      params.approveCashoutRequestId = result._id;

      return params;
    }
  } 

  async generateInsertCashoutHistory (params) {
    console.log("inside generateInsertCashoutHistory", params);
    
    
      params.createdAt = new Date()
      params.updatedAt = new Date()
      params.status = params.is_confirmed ?  "Success" : "Rejected"
      params.invoiceId = params.invoiceId
      params.userName = params.userData.userName

      const result = await this.cashoutHistoryService.insertIntoCashoutHistory(
        params,
      )
      console.log("result====== ", result);
        if (params.is_confirmed) {
          const updateBalance = await this.balanceSheetService.updateBalanceSheet({
            $inc: {
              withdrawal: params.requestedAmount,
              tds: params.tds,
            },
          })
    
          console.log("updateBalance: ", updateBalance)
    
          if (!!updateBalance) {
            console.log(
              'the result found in increaseAmountInFinanceDb in fundTransferManagement is',
              updateBalance,
            )
          } else {
            console.log('Could not increaseAmountInFinanceDb History')
          }
    
          const content: any = {
            userName: params.realName,
            chips: params.requestedAmount,
            referenceNo: params.referenceNo,
            amount: params.netAmount,
            accountNumber: params.accountNumber,
            tds: params.tds,
          }
    
          if (params.emailId&&params.is_confirmed) {
            console.log("vao 3")
            
            var mailData = this.createMailData({
              content: content,
              toEmail: params.emailId,
              subject: 'You cash out request has been processed',
              template: 'cashoutSuccessful',
            })
            const result1 = await this.mailService.sendMailWithHtml(mailData)
            if (result1) {
              console.log('Mail sent successfully')
            } else {
              console.log('Mail not sent')
            }
          }
        } else {
          if (params.withdrawalType != 'realChips') { 
            var query: any = {}
            query.userName = params.userData.userName
            const updateteAffiliateCashout = await this.model.findOneAndUpdate(query, { $inc: {profit:params.requestedAmount } }, { new: true })
          }
        }
      
      return {
        success: true,
        result: result,
      }
  }

  async deleteApproveCashout (params) {
    console.log("inside deleteApproveCashout", params);

    await this.pendingCashOutRequest.remove({ _id: params.pendingCashoutId });
    await this.approveCashoutRequestService.remove(params.approveCashoutRequestId);
  }

  async sendPayment(params) {
    console.log('inside getAccount');
    const data = {
      invoiceId: params.invoiceId,
      amount: params.requestedAmount
    }
    let resultData:any;
    try {
      const response:any = await axios.post("http://paymentservice.texashodl.net:7575/api/lnd/PayByInvoiceAndAmount",data);
      console.log("response: ", response);
      resultData = response.data;
    } catch (err) {
      console.log(err);
    }
    
    
    params.successPayment = false;
      params.is_confirmed = false;
    if (resultData&&resultData.data && resultData.data.payment_hash) {
      // params.transactionId = JSON.parse(response.result).data.id;
      params.successPayment = true;
      params.is_confirmed = true;
      params.transactionId = resultData.data.payment_hash;
      params.referenceNo = resultData.data.payment_hash;
    }
    return params;
  }

  async createAffilateWithDrawlRequestWithInvoiceId (params) {
    console.log("inside createAffilateWithDrawlRequestWithInvoiceId", params);
    params.WithdrawAmmount = parseInt(params.requestedAmount);
    await this.checkUserData(params)
    const realChipsCheck = await this.checkUserWithdrawlRealChips(params)
    const rakeCheck =  await this.checkUserWithdrawlRakeChips(params)
    await this.calculateUserTDSRealChips(params)
    await this.calculateUserTDSRakeChips(params)
    await this.generateWithdrawlRequest(params)
    await this.genarateProcessApproveCashout(params)
    await this.sendPayment(params);
    await this.generateInsertCashoutHistory(params)
    await this.deleteApproveCashout(params);

    return params;
  }

}
