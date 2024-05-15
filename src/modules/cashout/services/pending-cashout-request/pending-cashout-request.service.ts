import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PendingCashoutRequestService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.PendingCashOutRequest)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  getAllCashoutDetailsToAdminInPending(query) {
    console.log(
      'Inside getAllCashoutDetailsToAdminInPending db query -->',
      query,
    );
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$profile',
          amountRequested: { $sum: '$requestedAmount' },
          totalTDS: { $sum: '$tds' },
          totalProcessingFees: { $sum: '$processingFees' },
          totalNetAmount: { $sum: '$netAmount' },
        },
      },
    ]);
  }

  getTotalChipsPulledSubAgentByAdminInPending(query) {
    console.log(
      'Inside getTotalChipsPulledSubAgentByAdminInPending db query -->',
      query,
    );
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$tdsType',
          requestedAmount: { $sum: '$requestedAmount' },
        },
      },
    ]);
  }

  getCashOutRequestCount(query) {
    if (query.userName) {
      query.userName = eval('/^' + query.userName + '$/i');
    }
    if (query.profile) {
      query.profile = { '$regex': query.profile, "$options": 'i' }
    }
    return this.model.count(query);
  }

  async listPendingCashOutRequest(body: any) {
    const params = await this.getPendingCashoutList(body);
    await this.calculateTotalPlayerRealPending(params);
    await this.calculateTotalAgentRakePending(params);
    await this.calculateTotalAgentRealPending(params);
    await this.calculateTotalAffRakePending(params);
    return {
      result: params.pendingCashoutList,
      affRakePending: params.totalAffRakePending,
      agentRakePending: params.totalAgentRakePending,
      agentRealPending: params.totalAgentRealPending,
      playerPending: params.playerCashoutPending,
    };
  }

  async getPendingCashoutList(params) {
    console.log("Inside getPendingCashoutList", params);
    const result = await this.listPendingCashOutRequestQuery(params);
    params.pendingCashoutList = result || [];
    return params;
  }

  listPendingCashOutRequestQuery(query) {
    console.log("inside listPendingCashOutRequest  ", query);
    if (query.userName) {
      query.userName = eval('/^' + query.userName + '$/i');
    }
    if (query.profile) {
      query.profile = { '$regex': query.profile, "$options": 'i' }
    }
    const skip = query.skip || 0;
    const limit = query.limit || 0;
    delete query.skip;
    delete query.limit;
    return this.model.find(query).skip(skip).limit(limit).sort({ requestedAt: -1 });
  }

  async calculateTotalPlayerRealPending(params) {
    console.log("inside total player real pending", params);
    const query: any = {};
    if (params.userName) {
      query.userName = params.userName;
    }
    if (params.referenceNo) {
      query.referenceNo = params.referenceNo;
    }
    if (params.requestedAt) query.requestedAt = params.requestedAt;
    params.playerCashoutPending = 0;
    query["profile"] = { $in: ["PLAYER", "Player"] };
    const result = await this.getUserCashoutPending(query);
    if (result.length > 0)
      params.playerCashoutPending =
        result[0].netAmountPending || 0;
    return params;
  }

  async calculateTotalAgentRakePending(params) {
    console.log("inside calculateTotalAgentRakePending");
    const query: any = {};
    if (params.userName) {
      query.userName = params.userName;
    }
    if (params.referenceNo) {
      query.referenceNo = params.referenceNo;
    }
    if (params.requestedAt) query.requestedAt = params.requestedAt;
    params.totalAgentRakePending = 0;
    query["profile"] = { $in: ["AGENT", "SUB-AGENT"] };
    query["tdsType"] = "Profit";
    const result = await this.getUserCashoutPending(query);
    if (result.length > 0)
      params.totalAgentRakePending =
        result[0].netAmountPending || 0;

    return params;
  }

  async calculateTotalAffRakePending(params) {
    console.log("inside calculateTotalAffRakePending");
    const query: any = {};
    if (params.userName) {
      query.userName = params.userName;
    }
    if (params.referenceNo) {
      query.referenceNo = params.referenceNo;
    }
    if (params.requestedAt) query.requestedAt = params.requestedAt;
    params.totalAffRakePending = 0;
    query["profile"] = { $in: ["AFFILIATE", "Sub-Affiliate"] };
    query["tdsType"] = "Profit";
    const result = await this.getUserCashoutPending(query);
    if (result.length > 0)
      params.totalAffRakePending =
        result[0].netAmountPending || 0;
    return params;
  }

  async calculateTotalAgentRealPending(params) {
    console.log("inside calculateTotalAgentRealPending");
    const query: any = {};
    if (params.userName) {
      query.userName = params.userName;
    }
    if (params.referenceNo) {
      query.referenceNo = params.referenceNo;
    }
    if (params.requestedAt) query.requestedAt = params.requestedAt;
    params.totalAgentRealPending = 0;
    query["profile"] = { $in: ["AGENT", "SUB-AGENT"] };
    query["tdsType"] = "Real Chips";
    const result = await this.getUserCashoutPending(query);
    if (result.length > 0)
      params.totalAgentRealPending = result[0].netAmountPending || 0;
    return params;
  }

  getUserCashoutPending(query) {
    console.log("Inside getUserCashoutPending db query -->", query);
    return this.model.aggregate([{ $match: query }, { $group: { _id: "_id", netAmountPending: { $sum: "$netAmount" } } }]).exec();
  }
}
