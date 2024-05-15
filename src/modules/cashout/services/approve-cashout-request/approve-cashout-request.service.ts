import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import axios from 'axios';

@Injectable()
export class ApproveCashoutRequestService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.ApproveCashOutRequest)
    protected readonly model: Model<any>,
    @InjectAdminModel(AdminDBModel.Deposit)
    protected readonly deposit: Model<any>,
  ) {
    super(model);
  }

  getAllCashoutDetailsToAdminInApproved(query) {
    console.log(
      'Inside getAllCashoutDetailsToAdminInApproved db query -->',
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

  getTotalChipsPulledSubAgentByAdminInApproved(query) {
    console.log(
      'Inside getTotalChipsPulledSubAgentByAdminInApproved db query -->',
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

  approveCashoutCount(params) {
    const query: any = {};
    if (params.referenceNo) {
      query.referenceNo = params.referenceNo;
    }
    if (params.userName) {
      query.userName = params.userName;
    }
    if (params.profile) {
      query.profile = { $regex: params.profile, $options: "i" };
    }
    return this.model.count(query);
  }

  async listApproveCashOutRequest(params) {
    return await this.listApproveCashOutRequestQuery(params);
  }

  async listApproveCashOutRequestQuery(params) {
    const query: any = {};
    if (params.referenceNo) {
      query.referenceNo = params.referenceNo;
    }
    if (params.userName) {
      query.userName = params.userName;
    }
    if (params.profile) {
      query.profile = { $regex: params.profile, $options: "i" };
    }
    const skip = params.skip;
    const limit = params.limit;
    // delete query.skip;
    // delete query.limit;
    return await this.model.find(query).skip(skip).limit(limit); ///.sort({ requestedAt: -1 });
  }

  getRequestPayment (params) {
    return this.deposit.findOne({ invoiceId: params.invoiceId }).exec();
  }

  async paymentInvoiceCashout (params) {
    const response = await axios({
      url: "http://lndc4.pokermoogley.com:7575/api/lnd/Payment",
      method: "post",
      data: { Payment: params.paymentRequest }
    });
    console.log("response: ", response.data);
    return response.data;
  }
}
