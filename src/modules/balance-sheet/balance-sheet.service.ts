import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBalanceSheetDto } from './dto/create-balance-sheet.dto';
import { UpdateBalanceSheetDto } from './dto/update-balance-sheet.dto';
import _ from 'underscore';
import { TransferToAffiliateHistoryService } from '../chips/services/transfer-to-affiliate-history/transfer-to-affiliate-history.service';
import { TransferToPlayerHistoryService } from '../chips/services/transfer-to-player-history/transfer-to-player-history.service';
import { AffiliateService } from '../user/services/affiliate/affiliate.service';
import { FundrakeService } from '../finance/services/fundrake/fundrake.service';
import { DirectCashoutService } from '../direct-cashout/direct-cashout.service';
import { DirectCashoutHistoryService } from '../direct-cashout/services/direct-cashout-history/direct-cashout-history.service';
import { UserService } from '../user/user.service';
import { PlayerRakeBackService } from '../player-rake-back/service/player-rake-back.service';
import { TableService } from '../table/table.service';
import { TransactionHistoryService } from '../transaction-history/services/transaction-history/transaction-history.service';
import { CashoutHistoryService } from '../direct-cashout/services/cashout-history/cashout-history.service';
import { PendingCashoutRequestService } from '../cashout/services/pending-cashout-request/pending-cashout-request.service';
import { ApproveCashoutRequestService } from '../cashout/services/approve-cashout-request/approve-cashout-request.service';
import { BalanceSheetService } from '../finance/services/balance-sheet/balance-sheet.service';
import { DailyBalanceSheetService } from '../finance/services/daily-balance-sheet/daily-balance-sheet.service';
import axios from 'axios';

@Injectable()
export class BalanceSheetManagementService {
  constructor(
    private readonly userService: UserService,
    private readonly transferToAffiliateHistoryService: TransferToAffiliateHistoryService,
    private readonly transferToPlayerHistoryService: TransferToPlayerHistoryService,
    private readonly affiliateService: AffiliateService,
    private readonly fundrakeService: FundrakeService,
    private readonly directCashoutService: DirectCashoutService,
    private readonly directCashoutHistoryService: DirectCashoutHistoryService,
    private readonly playerRakeBackService: PlayerRakeBackService,
    private readonly tableService: TableService,
    private readonly transactionHistoryService: TransactionHistoryService,
    private readonly cashoutHistoryService: CashoutHistoryService,
    private readonly pendingCashoutRequestService: PendingCashoutRequestService,
    private readonly approveCashoutRequestService: ApproveCashoutRequestService,
    private readonly balanceSheetService: BalanceSheetService,
    private readonly dailyBalanceSheetService: DailyBalanceSheetService,
  ) {}
  /**
   * API used to get all details of user(aff,subaff,agent,subagent) required for balance sheet module
   */
  async listAffiliateDetailsForBalanceSheet(params) {
    console.log('inside listAgentdetailsForBalanceSheet', params);
    await this.getFundTransferToAgent(params);
    await this.getFundTransferToPlayerByAll(params);
    await this.getUserAvailableRakeData(params);
    await this.getUsersForRakeGeneratedData(params);
    await this.getAgentRakeGeneratedData(params);
    await this.getAffiliateRakeGeneratedData(params);
    await this.getSubAffiliateRakeGeneratedData(params);
    await this.getSubAgentRakeGeneratedData(params);
    await this.getSubAgentPendingCashoutsToAgent(params);
    await this.getPlayerPendingCashoutsToAgent(params);
    await this.getPlayerPendingCashoutsToSubAgent(params);
    await this.getSubAgentApprovedCashoutsToAgent(params);
    await this.getPlayerSucessCashoutsToAgent(params);
    await this.getPlayerSucessCashoutsToSubagent(params);
    return await this.getTotalTransferToSubAgentByAgent(params);
  }

  /**
   * method used to get the total fund transfer by admin,Director etc to agents
   */
  async getFundTransferToAgent(params) {
    console.log('Inside getFundTransferToAgent function'); // we can do this in one query
    const query: any = {};
    query['role.level'] = { $gt: 0 };
    query.userType = 'affiliate';
    params.totalFundTranferredToAgent = 0;
    const result = await this.transferToAffiliateHistoryService.aggregate([
      { $match: query },
      {
        $group: {
          _id: '_id',
          totalAmountTransferredToAgent: { $sum: '$amount' },
        },
      },
    ]);
    if (result.length > 0)
      params.totalFundTranferredToAgent =
        result[0].totalAmountTransferredToAgent || 0;
    return result;
  }

  async getFundTransferToPlayerByAll(params) {
    console.log('inside get fund transfer to player by all');
    params.totalTranferToPlayerByAgent = 0;
    params.totalTranferToPlayerBySubagent = 0;
    params.totalTranferToPlayerByAdmin = 0;
    const result =
      await this.transferToPlayerHistoryService.findFundTransferToPlayerByLevel(
        {},
      );
    console.trace('Digvijay result inside this function');
    console.log('result', result);
    result.map((obj) => {
      if (obj._id == 0) {
        params.totalTranferToPlayerByAgent += obj.amount;
      } else if (obj._id == -1) {
        params.totalTranferToPlayerBySubagent += obj.amount;
      } else {
        params.totalTranferToPlayerByAdmin += obj.amount;
      }
    });
  }

  /**
   * method used to get the total fund transfer to players by their agents
   */
  async getFundTransferPlayerByAgent(params) {
    console.log('Inside getFundTransferPlayerByAgent function');
    const query: any = {};
    query['role.name'] = 'affiliate';
    params.totalTranferToPlayerByAgent = 0;
    const result =
      await this.transferToPlayerHistoryService.findFundTransferToPlayerByAgent(
        query,
      );
    if (result.length > 0)
      params.totalTranferToPlayerByAgent =
        result[0].amountTransferredToPlayer || 0;
    return result;
  }

  /**
   * method used to get the total fund transfer to players by their subagents
   */
  async getFundTransferPlayerBySubagent(params) {
    console.log('Inside getFundTransferPlayerBySubagent function');
    const query: any = {};
    query['role.name'] = 'subAffiliate';
    params.totalTranferToPlayerBySubagent = 0;
    const result =
      await this.transferToPlayerHistoryService.findFundTransferToPlayerByAgent(
        query,
      );
    if (result.length > 0)
      params.totalTranferToPlayerBySubagent =
        result[0].amountTransferredToPlayer || 0;
  }

  /**
   * method used to compute the total rake available to the particular user(aff,subaff,agent,subAgent)
   */
  async getUserAvailableRakeData(params) {
    console.log('Inside getUserAvailableRakeData function');
    const query = {};
    params.totalRakeAvailableAgent = 0;
    params.totalRakeAvailablesSubAgent = 0;
    params.totalRakeAvailableAffiliate = 0;
    params.totalRakeAvailableSubAffiliate = 0;
    const result = await this.affiliateService.getUserAvailableRakeData(query);
    if (result.length > 0) {
      params.totalRakeAvailableAgent = _.findWhere(result, { _id: 'affiliate' })
        ? _.findWhere(result, { _id: 'affiliate' }).totalAvailableRake
        : 0;
      params.totalRakeAvailablesSubAgent = _.findWhere(result, {
        _id: 'subAffiliate',
      })
        ? _.findWhere(result, { _id: 'subAffiliate' }).totalAvailableRake
        : 0;
      params.totalRakeAvailableAffiliate = _.findWhere(result, {
        _id: 'newaffiliate',
      })
        ? _.findWhere(result, { _id: 'newaffiliate' }).totalAvailableRake
        : 0;
      params.totalRakeAvailableSubAffiliate = _.findWhere(result, {
        _id: 'newsubAffiliate',
      })
        ? _.findWhere(result, { _id: 'newsubAffiliate' }).totalAvailableRake
        : 0;
    }
  }

  /**
   * method used to get the usernames of particular users(i.e aff,sub-aff,agents,subagents) in array
   * for calculating their rake data.
   */
  async getUsersForRakeGeneratedData(params) {
    console.log('Inside getUsersForRakeGeneratedData function');
    const query = {};
    const result = await this.affiliateService.getUsersForRakeGeneratedData(
      query,
    );
    if (result.length > 0) {
      params.agentArr = _.findWhere(result, { _id: 'affiliate' })
        ? _.findWhere(result, { _id: 'affiliate' }).userDetails
        : [];
      params.subagentArr = _.findWhere(result, { _id: 'subAffiliate' })
        ? _.findWhere(result, { _id: 'subAffiliate' }).userDetails
        : [];
      params.affArr = _.findWhere(result, { _id: 'newaffiliate' })
        ? _.findWhere(result, { _id: 'newaffiliate' }).userDetails
        : [];
      params.subAffArr = _.findWhere(result, { _id: 'newsubAffiliate' })
        ? _.findWhere(result, { _id: 'newsubAffiliate' }).userDetails
        : [];
    }
  }

  /**
   * method used to calculate the total rake generated by agents.
   */
  async getAgentRakeGeneratedData(params) {
    const query: any = {};
    query['debitToAffiliatename'] = { $in: params.agentArr };
    params.totalRakeGeneratedByAgent = 0;
    const result = await this.fundrakeService.getAffOrAgentRakeGenerated(
      query,
      '$debitToAffiliateamount',
    );
    if (result.length > 0) {
      params.totalRakeGeneratedByAgent = result[0].totalRakeGenerated || 0;
    }
  }

  /**
   * method used to get the total rake generated by affiliates
   */
  async getAffiliateRakeGeneratedData(params) {
    const query: any = {};
    query['debitToAffiliatename'] = { $in: params.affArr };
    params.totalRakeGeneratedByAffiliate = 0;
    const result = await this.fundrakeService.getAffOrAgentRakeGenerated(
      query,
      '$debitToAffiliateamount',
    );
    if (result.length > 0) {
      params.totalRakeGeneratedByAffiliate = result[0].totalRakeGenerated || 0;
    }
  }

  /**
   * method used to calculate the total rake generated by subAffiliates
   */
  async getSubAffiliateRakeGeneratedData(params) {
    const query: any = {};
    query['debitToSubaffiliatename'] = { $in: params.subAffArr };
    params.totalRakeGeneratedBySubaff = 0;
    const result = await this.fundrakeService.getAffOrAgentRakeGenerated(
      query,
      '$debitToSubaffiliateamount',
    );
    if (result.length > 0) {
      params.totalRakeGeneratedBySubaff = result[0].totalRakeGenerated || 0;
    }
  }

  /**
   * method used to calculate the total rake generated by subagents
   */
  async getSubAgentRakeGeneratedData(params) {
    const query: any = {};
    query['debitToSubaffiliatename'] = { $in: params.subagentArr };
    params.totalRakeGeneratedBySubagent = 0;
    const result = await this.fundrakeService.getAffOrAgentRakeGenerated(
      query,
      '$debitToSubaffiliateamount',
    );
    if (result.length > 0) {
      params.totalRakeGeneratedBySubagent = result[0].totalRakeGenerated || 0;
    }
  }

  /**
   * method used get the total pending cashouts(both real chips and rake) of subagents to agents
   */
  async getSubAgentPendingCashoutsToAgent(params) {
    const query = {
      profile: 'subAffiliate',
      userName: { $in: params.subagentArr },
    }; // we can remove this username query param
    params.subAgentPendingRakeCashoutToAgent = 0;
    params.subAgentPendingRealCashoutToAgent = 0;
    const result =
      await this.directCashoutService.getSubAgentPendingCashoutsToAgent(query);
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id == 'Profit Chips')
          params.subAgentPendingRakeCashoutToAgent = result[i].amount || 0;
        if (result[i]._id == 'Real Chips')
          params.subAgentPendingRealCashoutToAgent = result[i].amount || 0;
      }
    }
  }

  /**
   * method used to get the total player pending cashouts to agent
   */
  async getPlayerPendingCashoutsToAgent(params) {
    const query = {
      profile: { $in: ['PLAYER', 'Player'] },
      $or: [
        { affiliateId: { $exists: true, $in: params.agentArr } },
        { affilateId: { $exists: true, $in: params.agentArr } },
      ],
    };
    params.playerPendingCashoutToAgent = 0;
    const result =
      await this.directCashoutService.getPlayerPendingCashoutsToAgent(query);
    if (result.length > 0) {
      params.playerPendingCashoutToAgent =
        result[0].amount + result[0].requestedAmount;
    }
  }

  /**
   * method used to get the total player pending cashouts to subagent.
   */
  async getPlayerPendingCashoutsToSubAgent(params) {
    const query = {
      profile: { $in: ['PLAYER', 'Player'] },
      $or: [
        { affiliateId: { $exists: true, $in: params.subagentArr } },
        { affilateId: { $exists: true, $in: params.subagentArr } },
      ],
    };
    params.playerPendingCashoutToSubAgent = 0;
    const result =
      await this.directCashoutService.getPlayerPendingCashoutsToAgent(query);
    if (result.length > 0) {
      params.playerPendingCashoutToSubAgent(
        result[0].amount + result[0].requestedAmount,
      ) || 0;
    }
  }

  /**
   * method used to get the total approved cashouts of subagents to agents
   */
  async getSubAgentApprovedCashoutsToAgent(params) {
    const query = {
      profile: 'subAffiliate',
      status: { $ne: 'Rejected' },
      userName: { $in: params.subagentArr },
    };
    params.totalSubAgentRakeCashoutSucess = 0;
    params.totalSubAgentRealCashoutSucess = 0;
    const result =
      await this.directCashoutHistoryService.getSubAgentApprovedCashoutsToAgent(
        query,
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id == 'Profit Chips')
          params.totalSubAgentRakeCashoutSucess = result[i].amount || 0;
        if (result[i]._id == 'Real Chips')
          params.totalSubAgentRealCashoutSucess = result[i].amount || 0;
      }
    }
  }

  /**
   * method used to get total player success cashouts to agents.
   */
  async getPlayerSucessCashoutsToAgent(params) {
    const query = {
      profile: { $in: ['PLAYER', 'Player'] },
      $or: [
        { affiliateId: { $exists: true, $in: params.agentArr } },
        { affilateId: { $exists: true, $in: params.agentArr } },
      ],
      status: 'Approved',
    };
    params.totalPlayerSucessCashoutsToAgent = 0;
    const result =
      await this.directCashoutHistoryService.getPlayerSucessCashoutsToAgent(
        query,
      );
    if (result.length > 0) {
      params.totalPlayerSucessCashoutsToAgent =
        result[0].amount + result[0].requestedAmount;
    }
  }

  /**
   * method use to get total player success cashouts to subagents
   */
  async getPlayerSucessCashoutsToSubagent(params) {
    const query = {
      profile: { $in: ['PLAYER', 'Player'] },
      $or: [
        { affiliateId: { $exists: true, $in: params.subagentArr } },
        { affilateId: { $exists: true, $in: params.subagentArr } },
      ],
      status: 'Approved',
    };
    params.totalPlayerSucessCashoutsToSubagent = 0;
    const result =
      await this.directCashoutHistoryService.getPlayerSucessCashoutsToAgent(
        query,
      );
    if (result.length > 0) {
      params.totalPlayerSucessCashoutsToSubagent =
        result[0].amount + result[0].requestedAmount;
    }
  }

  /**
   * method used to get the total trnsfer to subAgents by agents
   */
  async getTotalTransferToSubAgentByAgent(params) {
    const query: any = {};
    query['role.level'] = 0;
    query['role.name'] = 'affiliate';
    query.userType = 'subAffiliate';
    params.totalTransferToSubAgentByAgent = 0;
    const result =
      await this.transferToAffiliateHistoryService.findTotalFundTransferToAgent(
        query,
      );
    if (result.length > 0) {
      params.totalTransferToSubAgentByAgent =
        result[0].totalAmountTransferredToAgent || 0;
    }
    delete params.agentArr;
    delete params.affArr;
    delete params.subAffArr;
  }

  /**
   * API used to get all players details required for balance sheet
   */
  async getPlayersDetailsForBalanceSheet(params) {
    console.log('inside getPlayersDetailsForBalanceSheet', params);
    await this.getPlayerRakeDetails(params);
    await this.getPlayerTotalRealOrInstantChipsAvailable(params);
    await this.getPlayerTotalRakebackReleased(params);
    await this.getPlayerTotalChipsOnTable(params);
    await this.getPotAmountOnTables(params);
    await this.getTotalRoundBetAmountInGame(params);
    return params;
  }

  /**
   * method used to get the total player rakeback,total rake generated and total GST of
   * all players
   */
  async getPlayerRakeDetails(params) {
    console.log('Inside getPlayerRakeDetails function');
    const query = {};
    params.totalRakeGeneratedByPlayers = 0;
    params.totalGST = 0;
    params.totalPlayerRakeBack = 0;
    const result = await this.fundrakeService.getUserRakeDataForBalanceSheet(
      query,
    );
    if (result.length > 0) {
      params.totalRakeGeneratedByPlayers = result[0].totalRake || 0;
      params.totalGST = result[0].totalGST || 0;
      params.totalPlayerRakeBack = result[0].totalPlayerRakeBack || 0;
    }
  }

  /**
   * method used to get players actual real or instant chips
   */
  async getPlayerTotalRealOrInstantChipsAvailable(params) {
    console.log('Inside getPlayerTotalRealOrInstantChipsAvailable function');
    const query = {};
    params.totalPlayerInstantChipsAvailable = 0;
    params.totalPlayerRealChipsAvailable = 0;
    const result =
      await this.userService.getPlayerTotalRealOrInstantChipsAvailable(query);
    if (result.length > 0) {
      params.totalPlayerInstantChipsAvailable =
        result[0].totalPlayerInstantChips || 0;
      params.totalPlayerRealChipsAvailable =
        result[0].totalPlayerRealChips || 0;
    }
  }

  /**
   * method used to get total rakeback released to players
   * @method getPlayerTotalRakebackReleased
   */
  async getPlayerTotalRakebackReleased(params) {
    console.log('Inside getPlayerTotalRakebackReleased function');
    const query = {};
    params.playerTotalRakebackReleased = 0;
    query['transfer'] = true;
    const result = await this.playerRakeBackService.getTotalRakebackReleased(
      query,
    );
    if (result.length > 0) {
      params.playerTotalRakebackReleased = result[0].totalRakeBackReleased || 0;
    }
  }

  /**
   * method used to calculate total player Real Chips on table and total Instant Chips On Table.
   */
  async getPlayerTotalChipsOnTable(params) {
    console.log('Inside getPlayerTotalChipsOnTable function');
    const query = {};
    params.playerTotalChipsOnTable = 0;
    params.playerTotalInstantChipsOnTable = 0;
    const result = await this.tableService.getPlayerTotalChipsOnTable(query);
    if (result.length > 0) {
      params.playerTotalChipsOnTable = result[0].totalChips || 0;
      params.playerTotalInstantChipsOnTable = result[0].totalInstantChips || 0;
    }
  }

  /**
   * method used get Total pot amount on all tables.
   */
  async getPotAmountOnTables(params) {
    console.log('Inside getPotAmountOnTables function');
    const query = {};
    params.totalPotAmountOnTable = 0;
    const result = await this.tableService.getPotAmountOnAllTables(query);
    if (result.length > 0) {
      params.totalPotAmountOnTable = result[0].totalPotAmountOnAllTables || 0;
    }
  }

  /**
   * method used to get total round bets amount of players on all tables
   */
  async getTotalRoundBetAmountInGame(params) {
    console.log('Inside getTotalRoundBetAmountInGame function');
    const query = {};
    params.totalRoundBetAmountInGame = 0;
    const result = await this.tableService.getTotalRoundBetAmountInGame(query);
    if (result.length > 0) {
      params.totalRoundBetAmountInGame = result[0].totalRoundBets || 0;
    }
  }

  /**
   * API used to get the Admin user(i.e director,general manager etc) details required for balance sheet
   */
  async getAdminDetailsForBalanceSheet(params) {
    console.log('inside getPlayersDetailsForBalanceSheet', params);
    await this.getTotalOnlineTransfer(params);
    await this.getTotalRakeGeneratedByAdmin(params);
    await this.getTotalPlayerCashoutsSuccessToAdmin(params);
    await this.getTotalAgentSuccessCashoutToAdmin(params);
    await this.getSubaffiliateSuccessCashoutToAdmin(params);
    await this.getAllPlayerOrAgentCashoutsToAdminInPending(params);
    await this.getAffOrSubAffOrAgentRakeCashoutsInPending(params);
    await this.getAllPlayerOrAgentsCashoutsInApproved(params);
    await this.getAffOrSubAffOrAgentRakeCashoutsInApproved(params);
    await this.getTotalPendingCashoutAmtToAdminOfPlayerOrAffOrAgent(params);
    await this.getTotalChipsPulledSubAgentByAdminInPending(params);
    await this.getTotalChipsPulledSubAgentByAdminInApproved(params);
    await this.getTotalChipsPulledSubAgentByAdminApproved(params);
    return params;
  }

  /**
   * API used to get the total rake admin
   */
  async getRakeToAdmin (params) {
    console.log("inside getRakeToAdmin", params);
    const rakeToAdmin = await this.playerRakeBackService.getRakeToAdmin(params);
    console.log("rakeToAdmin==== ", rakeToAdmin);
    
    params.rakeToAdmin = rakeToAdmin&&rakeToAdmin[0] ? rakeToAdmin[0].rakeToAdmin : 0;
    return params;
  }

  /**
   * API used to get total rake from 1st line
   */
  async getRakeFrom1stLine (params) {
    console.log("inside getRakeFrom1stLine", params);
    const rakeTo1stLineReject = await this.playerRakeBackService.getRakeFrom1stLineReject(params);
    const rakeTo1stLineApproved = await this.playerRakeBackService.getRakeFrom1stLineApproved(params);
    const rakeTo1stLine = await this.playerRakeBackService.getRakeFrom1stLine(params);
    const rakeResTo1stLine = rakeTo1stLine[0] ?  rakeTo1stLine[0].RakeFrom1StLine : 0;
    const rakeRejTo1stLine = rakeTo1stLineReject[0] ? rakeTo1stLineReject[0].RakeFrom1StLine : 0;
    params.rakeFrom1stLine = rakeResTo1stLine - rakeRejTo1stLine;
    params.rakeTo1stLineReject = rakeTo1stLineReject;
    params.rakeTo1stLineApproved = rakeTo1stLineApproved;
    return params;
  }

  /**
   * API used to get total rake from 2nd line
   */
  async getRakeFrom2ndLine (params) {
    console.log("inside getRakeFrom2ndLine", params);
    const rakeTo2ndLineReject = await this.playerRakeBackService.getRakeFrom2ndLineReject(params);
    const rakeTo2ndLineApproved = await this.playerRakeBackService.getRakeFrom2ndLineApproved(params);
    const rakeTo2ndLine = await this.playerRakeBackService.getRakeFrom2ndLine(params);
    const rakeResTo2ndLine = rakeTo2ndLine[0] ?  rakeTo2ndLine[0].RakeFrom2ndLine : 0;
    const rakeRejTo2ndLine = rakeTo2ndLineReject[0] ? rakeTo2ndLineReject[0].RakeFrom2ndLine : 0;
    params.rakeFrom2ndLine = rakeResTo2ndLine - rakeRejTo2ndLine;
    params.rakeTo2ndLineReject = rakeTo2ndLineReject;
    params.rakeTo2ndLineApproved = rakeTo2ndLineApproved;
    return params;
  }

  /**
   * API used to get total rake to admin reconcile
   */
  async getRakeToAdminReconcile (params) {
    console.log("inside getRakeToAdminReconcile", params);
    const rakeTo1stLineReject = await this.playerRakeBackService.getRakeFrom1stLineReject(params);
    const rakeTo2ndLineReject = await this.playerRakeBackService.getRakeFrom2ndLineReject(params);
    const rakeTo1stLineRejectR = rakeTo1stLineReject[0] ? rakeTo1stLineReject[0].RakeFrom1StLine : 0;
    const rakeTo2ndLineRejectR = rakeTo2ndLineReject[0] ? rakeTo2ndLineReject[0].RakeFrom2ndLine : 0;
    params.rakeToAdminReconcile = rakeTo1stLineRejectR + rakeTo2ndLineRejectR;
    return params;
  }

  /**
   * method used to compute the total fund transfer to player By admin,director etc.
   */
  async getTotalfundTransferPlayerbyAdmin(params) {
    console.log('Inside getTotalfundTransferbyAdmin function');
    const query = {};
    query['role.level'] = { $gt: 0 };
    params.totalTranferToPlayerByAdmin = 0;
    const result =
      await this.transferToPlayerHistoryService.findFundTransferToPlayerByAgent(
        query,
      );
    if (result.length > 0)
      params.totalTranferToPlayerByAdmin =
        result[0].amountTransferredToPlayer || 0;
  }

  /**
   * method used to get the total online transfer
   */
  async getTotalOnlineTransfer(params) {
    console.log('Inside getTotalOnlineTransfer function');
    const query = { transferMode: 'Lightning Deposit', status: 'SUCCESS' };
    params.totalOnlineChipsAdded = 0;
    const result = await this.transactionHistoryService.getTotalOnlineTransfer(
      query,
    );
    if (result.length > 0)
      params.totalOnlineChipsAdded = result[0].totalOnlineTransfer || 0;
  }

  /**
   * method used to get the total rake generated by admin
   */
  async getTotalRakeGeneratedByAdmin(params) {
    console.log('Inside getTotalRakeGeneratedByAdmin function');
    params.totalRakeGeneratedByAdmin = 0;
    const result = await this.fundrakeService.getUserRakeDataForBalanceSheet(
      {},
    );
    if (result.length > 0) {
      params.totalRakeGeneratedByAdmin = result[0].totalRakeToAdmin || 0;
    }
  }

  /**
   * method used to get the total player sucessfull cashouts to admin.
   */
  async getTotalPlayerCashoutsSuccessToAdmin(params) {
    console.log('Inside getTotalPlayerCashoutsSuccessToAdmin function', params);
    params.totalPlayerCashoutSuccessToAdmin = 0;
    params.playerCashoutSuccessNetAmtToAdmin = 0;
    params.playerCashoutSuccessTdsAmtToAdmin = 0;
    params.playerCashoutSuccessProcessingFeesToAdmin = 0;
    const query = { profile: { $in: ["PLAYER", "Player"] }, status: "Success" };
    const result =
      await this.cashoutHistoryService.getUserCashoutSuccessDetails(
        query,
        '_id',
      );
      console.log("result====111 ", result);
    if (result.length > 0) {
      params.totalPlayerCashoutSuccessToAdmin =
        result[0].totalRequestedAmount || 0;
      params.playerCashoutSuccessNetAmtToAdmin = result[0].totalNetAmount || 0;
      params.playerCashoutSuccessTdsAmtToAdmin = result[0].totalTDS || 0;
      params.playerCashoutSuccessProcessingFeesToAdmin =
        result[0].totalProcessingFees || 0;
    }
  }

  /**
   * method used to get the total agent successfull cashouts (both real and rake) to admin
   */
  async getTotalAgentSuccessCashoutToAdmin(params) {
    console.log('Inside getTotalAgentSuccessCashoutToAdmin function');
    params.totalAgentCashoutRealSuccessToAdmin = 0;
    params.agentCashoutRealSuccessNetAmtToAdmin = 0;
    params.agentCashoutRealSuccessTdsAmtToAdmin = 0;
    params.agentCashoutRealSuccessProcessingFeesToAdmin = 0;
    params.totalAgentCashoutRakeSuccessToAdmin = 0;
    params.agentCashoutRakeSuccessNetAmtToAdmin = 0;
    params.agentCashoutRakeSuccessTdsAmtToAdmin = 0;
    params.agentCashoutRakeSuccessProcessingFeesToAdmin = 0;
    const query = { profile: { $in: ['AGENT', 'agent'] }, status: 'Success' };
    const result =
      await this.cashoutHistoryService.getUserCashoutSuccessDetails(
        query,
        '$tdsType',
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id == 'Real Chips') {
          params.totalAgentCashoutRealSuccessToAdmin =
            result[i].totalRequestedAmount || 0;
          params.agentCashoutRealSuccessNetAmtToAdmin =
            result[i].totalNetAmount || 0;
          params.agentCashoutRealSuccessTdsAmtToAdmin = result[i].totalTDS || 0;
          params.agentCashoutRealSuccessProcessingFeesToAdmin =
            result[i].totalProcessingFees || 0;
        } else if (result[i]._id == 'Profit') {
          params.totalAgentCashoutRakeSuccessToAdmin =
            result[i].totalRequestedAmount || 0;
          params.agentCashoutRakeSuccessNetAmtToAdmin =
            result[i].totalNetAmount || 0;
          params.agentCashoutRakeSuccessTdsAmtToAdmin = result[i].totalTDS || 0;
          params.agentCashoutRakeSuccessProcessingFeesToAdmin =
            result[i].totalProcessingFees || 0;
        }
      }
    }
  }

  /**
   * method used to get the sucessfull cashouts of affiliates to admin.
   */
  async getAffiliateSuccessCashoutToAdmin(params) {
    console.log('Inside getAffiliateSuccessCashoutToAdmin function');
    params.totalAffCashoutSuccessToAdmin = 0;
    params.affCashoutSuccessNetAmtToAdmin = 0;
    params.affCashoutSuccessTdsAmtToAdmin = 0;
    params.affCashoutSuccessProcessingFeesToAdmin = 0;
    const query = {
      profile: { $in: ['AFFILIATE'] },
      status: 'Success',
      tdsType: 'Profit',
    };
    const result = await this.cashoutHistoryService.getAffCashoutSuccessDetails(
      query,
    );
    if (result.length > 0) {
      params.totalAffCashoutSuccessToAdmin =
        result[0].totalRequestedAmount || 0;
      params.affCashoutSuccessNetAmtToAdmin = result[0].totalNetAmount || 0;
      params.affCashoutSuccessTdsAmtToAdmin = result[0].totalTDS || 0;
      params.affCashoutSuccessProcessingFeesToAdmin =
        result[0].totalProcessingFees || 0;
    }
  }

  /**
   * method used to get the sucessfull cashouts of subaffiliates to admin.
   */
  async getSubaffiliateSuccessCashoutToAdmin(params) {
    console.log('Inside getSubaffiliateSuccessCashoutToAdmin function');
    params.totalSubAffCashoutSuccessToAdmin = 0;
    params.subAffCashoutSuccessNetAmtToAdmin = 0;
    params.subAffCashoutSuccessTdsAmtToAdmin = 0;
    params.subAffCashoutSuccessProcessingFeesToAdmin = 0;
    const query = {
      profile: 'Sub-Affiliate',
      status: 'Success',
      tdsType: 'Profit',
    };
    const result = await this.cashoutHistoryService.getAffCashoutSuccessDetails(
      query,
    );
    if (result.length > 0) {
      params.totalSubAffCashoutSuccessToAdmin =
        result[0].totalRequestedAmount || 0;
      params.subAffCashoutSuccessNetAmtToAdmin = result[0].totalNetAmount || 0;
      params.subAffCashoutSuccessTdsAmtToAdmin = result[0].totalTDS || 0;
      params.subAffCashoutSuccessProcessingFeesToAdmin =
        result[0].totalProcessingFees || 0;
    }
  }

  /**
   * method used to calculate total real chips cashout of player and agent to admin.
   */
  async getAllPlayerOrAgentCashoutsToAdminInPending(params) {
    console.log('Inside getAllCashoutsToAdminInPending function');
    params.totalRealAgentCashoutInPending = 0;
    params.agentRealCashoutNetAmtInPending = 0;
    params.agentRealCashoutProcessingFeesInPending = 0;
    params.agentRealCashoutTdsAmtInPending = 0;
    params.totalPlayerCashoutInPending = 0;
    params.playerCashoutNetAmtInPending = 0;
    params.playerCashoutProcessingFeesInPending = 0;
    params.playerCashoutTdsAmtInPending = 0;
    const result =
      await this.pendingCashoutRequestService.getAllCashoutDetailsToAdminInPending(
        { tdsType: 'Real Chips' },
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id.toUpperCase() == 'AGENT') {
          params.totalRealAgentCashoutInPending =
            result[i].amountRequested || 0;
          params.agentRealCashoutNetAmtInPending =
            result[i].totalNetAmount || 0;
          params.agentRealCashoutProcessingFeesInPending =
            result[i].totalProcessingFees || 0;
          params.agentRealCashoutTdsAmtInPending = result[i].totalTDS || 0;
        } else if (result[i]._id.toUpperCase() == 'PLAYER') {
          params.totalPlayerCashoutInPending = result[i].amountRequested || 0;
          params.playerCashoutNetAmtInPending = result[i].totalNetAmount || 0;
          params.playerCashoutProcessingFeesInPending =
            result[i].totalProcessingFees || 0;
          params.playerCashoutTdsAmtInPending = result[i].totalTDS || 0;
        }
      }
    }
  }

  /**
   * method used to calculate total aff,subaff and agent rake cashouts in pending
   * @method getAffOrSubAffOrAgentRakeCashoutsInPending
   */
  async getAffOrSubAffOrAgentRakeCashoutsInPending(params) {
    console.log('Inside getAffOrSubAffOrAgentRakeCashoutsInPending function');
    params.totalRakeAgentCashoutInPending = 0;
    params.agentRakeCashoutNetAmtInPending = 0;
    params.agentRakeCashoutProcessingFeesInPending = 0;
    params.agentRakeCashoutTdsAmtInPending = 0;
    params.totalSubaffRakeCashoutInPending = 0;
    params.subAffRakeCashoutNetAmtInPending = 0;
    params.subAffRakeCashoutProcessingFeesInPending = 0;
    params.subAffRakeCashoutTdsAmtInPending = 0;
    params.totalAffRakeCashoutInPending = 0;
    params.affRakeCashoutNetAmtInPending = 0;
    params.affRakeCashoutProcessingFeesInPending = 0;
    params.affRakeCashoutTdsAmtInPending = 0;
    const result =
      await this.pendingCashoutRequestService.getAllCashoutDetailsToAdminInPending(
        { tdsType: 'Profit' },
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id.toUpperCase() == 'AGENT') {
          params.totalRakeAgentCashoutInPending =
            result[i].amountRequested || 0;
          params.agentRakeCashoutNetAmtInPending =
            result[i].totalNetAmount || 0;
          params.agentRakeCashoutProcessingFeesInPending =
            result[i].totalProcessingFees || 0;
          params.agentRakeCashoutTdsAmtInPending = result[i].totalTDS || 0;
        } else if (result[i]._id == 'Sub-Affiliate') {
          params.totalSubaffRakeCashoutInPending =
            result[i].amountRequested || 0;
          params.subAffRakeCashoutNetAmtInPending =
            result[i].totalNetAmount || 0;
          params.subAffRakeCashoutProcessingFeesInPending =
            result[i].totalProcessingFees || 0;
          params.subAffRakeCashoutTdsAmtInPending = result[i].totalTDS || 0;
        } else if (result[i]._id == 'AFFILIATE') {
          params.totalAffRakeCashoutInPending = result[i].amountRequested || 0;
          params.affRakeCashoutNetAmtInPending = result[i].totalNetAmount || 0;
          params.affRakeCashoutProcessingFeesInPending =
            result[i].totalProcessingFees || 0;
          params.affRakeCashoutTdsAmtInPending = result[i].totalTDS || 0;
        }
      }
    }
  }

  /**
   * method used to compute total Real chips cashouts os players and agents in approved.
   */
  async getAllPlayerOrAgentsCashoutsInApproved(params) {
    console.log('Inside getAllPlayerOrAgentsCashoutsInApproved function');
    params.totalRealAgentCashoutInApproved = 0;
    params.agentRealCashoutNetAmtInApproved = 0;
    params.agentRealCashoutProcessingFeesInApproved = 0;
    params.agentRealCashoutTdsAmtInApproved = 0;
    params.totalPlayerCashoutInApproved = 0;
    params.playerCashoutNetAmtInApproved = 0;
    params.playerCashoutProcessingFeesInApproved = 0;
    params.playerCashoutTdsAmtInApproved = 0;
    const result =
      await this.approveCashoutRequestService.getAllCashoutDetailsToAdminInApproved(
        { tdsType: 'Real Chips' },
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id.toUpperCase() == 'AGENT') {
          params.totalRealAgentCashoutInApproved =
            result[i].amountRequested || 0;
          params.agentRealCashoutNetAmtInApproved =
            result[i].totalNetAmount || 0;
          params.agentRealCashoutProcessingFeesInApproved =
            result[i].totalProcessingFees || 0;
          params.agentRealCashoutTdsAmtInApproved = result[i].totalTDS || 0;
        } else if (result[i]._id.toUpperCase() == 'PLAYER') {
          params.totalPlayerCashoutInApproved = result[i].amountRequested || 0;
          params.playerCashoutNetAmtInApproved = result[i].totalNetAmount || 0;
          params.playerCashoutProcessingFeesInApproved =
            result[i].totalProcessingFees || 0;
          params.playerCashoutTdsAmtInApproved = result[i].totalTDS || 0;
        }
      }
    }
  }

  /**
   * method used to calculate total rake cashouts of aff,subaff and agent to admin in approved.
   */
  async getAffOrSubAffOrAgentRakeCashoutsInApproved(params) {
    console.log('Inside getAffOrSubAffOrAgentRakeCashoutsInApproved function');
    params.totalRakeAgentCashoutInApproved = 0;
    params.agentRakeCashoutNetAmtInApproved = 0;
    params.agentRakeCashoutProcessingFeesInApproved = 0;
    params.agentRakeCashoutTdsAmtInApproved = 0;
    params.totalSubaffRakeCashoutInApproved = 0;
    params.subAffRakeCashoutNetAmtInApproved = 0;
    params.subAffRakeCashoutProcessingFeesInApproved = 0;
    params.subAffRakeCashoutTdsAmtInApproved = 0;
    params.totalAffRakeCashoutInApproved = 0;
    params.affRakeCashoutNetAmtInApproved = 0;
    params.affRakeCashoutProcessingFeesInApproved = 0;
    params.affRakeCashoutTdsAmtInApproved = 0;
    const result =
      await this.approveCashoutRequestService.getAllCashoutDetailsToAdminInApproved(
        { tdsType: 'Profit' },
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id.toUpperCase() == 'AGENT') {
          params.totalRakeAgentCashoutInApproved =
            result[i].amountRequested || 0;
          params.agentRakeCashoutNetAmtInApproved =
            result[i].totalNetAmount || 0;
          params.agentRakeCashoutProcessingFeesInApproved =
            result[i].totalProcessingFees || 0;
          params.agentRakeCashoutTdsAmtInApproved = result[i].totalTDS || 0;
        } else if (result[i]._id == 'Sub-Affiliate') {
          params.totalSubaffRakeCashoutInApproved =
            result[i].amountRequested || 0;
          params.subAffRakeCashoutNetAmtInApproved =
            result[i].totalNetAmount || 0;
          params.subAffRakeCashoutProcessingFeesInApproved =
            result[i].totalProcessingFees || 0;
          params.subAffRakeCashoutTdsAmtInApproved = result[i].totalTDS || 0;
        } else if (result[i]._id == 'AFFILIATE') {
          params.totalAffRakeCashoutInApproved = result[i].amountRequested || 0;
          params.affRakeCashoutNetAmtInApproved = result[i].totalNetAmount || 0;
          params.affRakeCashoutProcessingFeesInApproved =
            result[i].totalProcessingFees || 0;
          params.affRakeCashoutTdsAmtInApproved = result[i].totalTDS || 0;
        }
      }
    }
  }

  /**
   * method used to calculate the total pending cashouts of player,agent,aff and subaff to admin.
   */
  getTotalPendingCashoutAmtToAdminOfPlayerOrAffOrAgent(params) {
    console.log(
      'Inside getTotalPendingCashoutAmtToAdminOfPlayerOrAffOrAgent function',
      params,
    );

    // for player(Real chips)
    params.totalPlayerCashoutAmtPending =
      params.totalPlayerCashoutInPending +
        params.totalPlayerCashoutInApproved || 0;
    params.playerCashoutNetAmtPending =
      params.playerCashoutNetAmtInPending +
        params.playerCashoutNetAmtInApproved || 0;
    params.playerCashoutTdsAmtPending =
      params.playerCashoutTdsAmtInPending +
        params.playerCashoutTdsAmtInApproved || 0;
    params.playerCashoutProcessingFeesAmtPending =
      params.playerCashoutProcessingFeesInPending +
        params.playerCashoutProcessingFeesInApproved || 0;

    // for agent(Real Chips)
    params.totalAgentCashoutRealAmtPending =
      params.totalRealAgentCashoutInPending +
        params.totalRealAgentCashoutInApproved || 0;
    params.agentCashoutRealNetAmtPending =
      params.agentRealCashoutNetAmtInPending +
        params.agentRealCashoutNetAmtInApproved || 0;
    params.agentCashoutRealTdsAmtPending =
      params.agentRealCashoutTdsAmtInPending +
        params.agentRealCashoutTdsAmtInApproved || 0;
    params.totalAgentCashoutRealProcessingFeesAmtPending =
      params.agentRealCashoutProcessingFeesInPending +
        params.agentRealCashoutProcessingFeesInApproved || 0;

    // for agent (Rake Chips)
    params.totalAgentCashoutRakeAmtPending =
      params.totalRakeAgentCashoutInPending +
        params.totalRakeAgentCashoutInApproved || 0;
    params.agentCashoutRakeNetAmtPending =
      params.agentRakeCashoutNetAmtInPending +
        params.agentRakeCashoutNetAmtInApproved || 0;
    params.agentCashoutRakeTdsAmtPending =
      params.agentRakeCashoutTdsAmtInPending +
        params.agentRakeCashoutTdsAmtInApproved || 0;
    params.totalAgentCashoutRakeProcessingFeesAmtPending =
      params.agentRakeCashoutProcessingFeesInPending +
        params.agentRakeCashoutProcessingFeesInApproved || 0;

    // for Affiliate(Rake Chips)
    params.totalAffCashoutRakeAmtPending =
      params.totalAffRakeCashoutInPending +
        params.totalAffRakeCashoutInApproved || 0;
    params.affCashoutRakeNetAmtPending =
      params.affRakeCashoutNetAmtInPending +
        params.affRakeCashoutNetAmtInApproved || 0;
    params.affCashoutRakeTdsAmtPending =
      params.affRakeCashoutTdsAmtInPending +
        params.affRakeCashoutTdsAmtInApproved || 0;
    params.totalAffCashoutRakeProcessingFeesAmtPending =
      params.affRakeCashoutProcessingFeesInPending +
        params.affRakeCashoutProcessingFeesInApproved || 0;

    // for sub-affiliate Rake Chips
    params.totalSubaffCashoutRakeAmtPending =
      params.totalSubaffRakeCashoutInPending +
        params.totalSubaffRakeCashoutInApproved || 0;
    params.subaffCashoutRakeNetAmtPending =
      params.subAffRakeCashoutNetAmtInPending +
        params.subAffRakeCashoutNetAmtInApproved || 0;
    params.subaffCashoutRakeTdsAmtPending =
      params.subAffRakeCashoutTdsAmtInPending +
        params.subAffRakeCashoutTdsAmtInApproved || 0;
    params.totalsubAffCashoutRakeProcessingFeesAmtPending =
      params.subAffRakeCashoutProcessingFeesInPending +
        params.subAffRakeCashoutProcessingFeesInApproved || 0;

    // removing extra fields
    delete params.totalPlayerCashoutInPending;
    delete params.totalPlayerCashoutInApproved;
    delete params.playerCashoutNetAmtInPending;
    delete params.playerCashoutNetAmtInApproved;
    delete params.playerCashoutTdsAmtInPending;
    delete params.playerCashoutTdsAmtInApproved;
    delete params.playerCashoutProcessingFeesInPending;
    delete params.playerCashoutProcessingFeesInApproved;
    delete params.totalRealAgentCashoutInPending;
    delete params.agentRealCashoutNetAmtInPending;
    delete params.totalRealAgentCashoutInPending;
    delete params.agentRealCashoutTdsAmtInPending;
    delete params.agentRealCashoutTdsAmtInApproved;
    delete params.agentRealCashoutProcessingFeesInPending;
    delete params.agentRealCashoutProcessingFeesInPending;
    delete params.agentRealCashoutProcessingFeesInApproved;
    delete params.totalRakeAgentCashoutInPending;
    delete params.agentRakeCashoutNetAmtInPending;
    delete params.agentRakeCashoutTdsAmtInPending;
    delete params.agentRakeCashoutProcessingFeesInPending;
    delete params.totalAffRakeCashoutInPending;
    delete params.affRakeCashoutNetAmtInPending;
    delete params.affRakeCashoutTdsAmtInPending;
    delete params.affRakeCashoutProcessingFeesInPending;
    delete params.totalSubaffRakeCashoutInPending;
    delete params.subAffRakeCashoutNetAmtInPending;
    delete params.subAffRakeCashoutTdsAmtInPending;
    delete params.subAffRakeCashoutProcessingFeesInPending;
    delete params.totalRakeAgentCashoutInApproved;
    delete params.agentRakeCashoutNetAmtInApproved;
    delete params.agentRakeCashoutTdsAmtInApproved;
    delete params.agentRakeCashoutProcessingFeesInApproved;
    delete params.agentRakeCashoutProcessingFeesInApproved;
    delete params.totalAffRakeCashoutInApproved;
    delete params.affRakeCashoutNetAmtInApproved;
    delete params.affRakeCashoutProcessingFeesInApproved;
    delete params.totalSubaffRakeCashoutInApproved;
    delete params.subAffRakeCashoutNetAmtInApproved;
    delete params.subAffRakeCashoutTdsAmtInApproved;
    delete params.subAffRakeCashoutProcessingFeesInApproved;
    // cb(null, params);
  }

  /**
   * method used to get total chips(i.e both real and rake) pulled by admin of SubAgents which are in pending
   */
  async getTotalChipsPulledSubAgentByAdminInPending(params) {
    console.log('Inside getTotalChipsPulledSubAgentByAdmin function -->');
    const query = {
      profile: 'SUB-AGENT',
      userName: { $in: params.subagentArr },
    };
    params.chipsPulledSubAgentByAdminRealInPending = 0;
    params.chipsPulledSubAgentByAdminRakelInPending = 0;
    const result =
      await this.pendingCashoutRequestService.getTotalChipsPulledSubAgentByAdminInPending(
        query,
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id == 'Real Chips')
          params.chipsPulledSubAgentByAdminRealInPending =
            result[i].requestedAmount;
        if (result[i]._id == 'Profit')
          params.chipsPulledSubAgentByAdminRakelInPending =
            result[i].requestedAmount;
      }
    }
  }

  /**
   * method used to get total chips(i.e both rake and real) pulled by admin of sub agent which are in approved.
   */
  async getTotalChipsPulledSubAgentByAdminInApproved(params) {
    console.log(
      'Inside getTotalChipsPulledSubAgentByAdminInApproved function -->',
    );
    const query = {
      profile: 'SUB-AGENT',
      userName: { $in: params.subagentArr },
    };
    params.chipsPulledSubAgentByAdminRealInApproved = 0;
    params.chipsPulledSubAgentByAdminRakeInApproved = 0;
    const result =
      await this.approveCashoutRequestService.getTotalChipsPulledSubAgentByAdminInApproved(
        query,
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id == 'Real Chips')
          params.chipsPulledSubAgentByAdminRealInApproved =
            result[i].requestedAmount;
        if (result[i]._id == 'Profit')
          params.chipsPulledSubAgentByAdminRakeInApproved =
            result[i].requestedAmount;
      }
    }
  }

  /**
   * method used to get total chips(i.e both rake and real) pulled by admin which are rejected.
   */
  async getTotalChipsPulledSubAgentByAdminApproved(params) {
    console.log(
      'Inside getTotalChipsPulledSubAgentByAdminApproved function -->',
    );
    const query = {
      profile: 'SUB-AGENT',
      status: 'Success',
      userName: { $in: params.subagentArr },
    };
    params.chipsPulledSubAgentByAdminRealApproved = 0;
    params.chipsPulledSubAgentByAdminRakeApproved = 0;
    console.log('query Naman -->', query);
    const result =
      await this.cashoutHistoryService.getTotalChipsPulledSubAgentByAdminApproved(
        query,
      );
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i]._id == 'Real Chips') {
          params.chipsPulledSubAgentByAdminRealApproved =
            result[i].requestedAmount;
        }
        if (result[i]._id == 'Profit')
          params.chipsPulledSubAgentByAdminRakeApproved =
            result[i].requestedAmount;
      }
    }
  }
  /**
   * Api used to get all bonus Details For balance Sheet
   */
  getBonusDetailsForBalanceSheet(params) {
    console.log('inside getBonusDetailsForBalanceSheet', params);
    return this.getAllBonusData(params);
  }

  /**
   * method used to get the required bonus details for balance sheet
   */
  async getAllBonusData(params) {
    console.log('Inside getAllBonusData function');
    const result: any = await this.balanceSheetService.findOne({});
    if (result) {
      params.leaderboardWinning = result.leaderboardWinning || 0;
      params.instantChipsPulled = result.instantChipsPulled || 0;
      params.lockedBonusReleased = result.lockedBonusReleased || 0;
      params.instantBonusReleased = result.instantBonusReleased || 0;
      params.lockedBonusAmountGenerated = result.lockedBonusAmount || 0;
      params.instantBonusAmountGenerated = result.instantBonusAmount || 0;
      params.totalTds = result.tds || 0;
      params.totalPromotionalChips = result.instaCashBonus + result.bonus || 0;
      params.totalPlayerScratchCardAmount = result.scratchCardUsed || 0;
    }
  }

  /**
   * method used to insert daily balance sheet into the database.
   */
  insertBalanceSheetDocInDb(params) {
    console.log('Inside insertBalanceSheetDocInDb function');
    const insertData: any = {};
    const time = new Date();
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    insertData.createdAt = Number(time);
    insertData.doc = params;
    return this.dailyBalanceSheetService.insertDataInDailyBalanceSheet(
      insertData,
    );
  }

  /**
   * API used to get all Data of Balance Sheet for all users i.e admin,aff,subaff,agent,subagent etc and
   * all the data in new collection with specific time added.
   * Cron Job method.
   */
  async getAllDataRequiredForBalanceSheet(params) {
    console.log('inside getAllDataRequiredForBalanceSheet', params);
    await this.listAffiliateDetailsForBalanceSheet(params);
    await this.getBonusDetailsForBalanceSheet(params);
    await this.getPlayersDetailsForBalanceSheet(params);
    return await this.insertBalanceSheetDocInDb(params);
  }

  /**
   * API used to to get the current balance sheet details for dashboard.
   * Get current data method.
   */
  async getCurrentDataOfBalanceSheetForDashboard(params) {
    console.log('inside getCurrentDataOfBalanceSheetForDashboard', params);
    await this.listAffiliateDetailsForBalanceSheet(params);
    await this.getBonusDetailsForBalanceSheet(params);
    await this.getPlayersDetailsForBalanceSheet(params);
    if (params.date) {
      return this.dailyBalanceSheetService.getBalanceSheetDataForDashboard({
        createdAt: {
          $lte: params.date,
        },
      });
    }
    await this.getAdminDetailsForBalanceSheet(params);
    // rake to admin - rake from 1st line - rake from 2nd line - rake to admin (reconcile)
    await this.getRakeToAdmin(params);
    await this.getRakeFrom1stLine(params);
    await this.getRakeFrom2ndLine(params);
    await this.getRakeToAdminReconcile(params);

    return params;
  }

  /**
   * API used to to get the current balance sheet details for dashboard.
   * Get current data method.
   */
  async getAccount() {
    console.log('inside getAccount');
    
    const response = await axios({
      url: "https://c4pokernew.pokermoogley.com:4040/account",
			method: "get",
		});
    console.log("response: ", response.data);
    return response.data;
  }

  /**
   * method used to get balance sheet details on daily basis for dashboard.
   * When date filter used.
   */
  public findAllBalanceSheetDataForDashboard(params) {
    console.log('inside findAllBalanceSheetDataForDashboard', params);
    const query = {};
    query['createdAt'] = { $lte: params.date };
    return this.dailyBalanceSheetService.findAllBalanceSheetDataForDashboard(
      query,
    );
  }

  findDetails(params) {
    if (!params.userRole) {
      throw new BadRequestException(
        'You are not authorised to view balance sheet!',
      );
    } else if (params.userRole && params.userRole.level < 1) {
      throw new BadRequestException(
        'You are not authorised to view balance sheet!',
      );
    } else {
      return this.balanceSheetService.findOne({});
    }
  }
}
