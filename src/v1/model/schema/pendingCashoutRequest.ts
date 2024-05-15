import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const pendingCashoutRequestSchema = new Schema(
  {
    requestedAmount: {
      type: Number,
    },
    netAmount: {
      type: Number,
    },
    name: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifcsCode: {
      type: String,
    },
    tds: {
      type: Number,
    },
    processingFees: {
      type: Number,
    },
    bankName: {
      type: String,
    },
    branchName: {
      type: String,
    },
    accountType: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    tdsType: {
      type: String,
    },
    profile: {
      type: String,
    },
    affiliateId: {
      type: String,
    },
    affiliateMobile: {
      type: Number,
    },
    realName: {
      type: String,
    },
    userName: {
      type: String,
    },
    referenceNo: {
      type: String,
    },
    requestedAt: {
      type: Number,
    },
    currentDepositAmount: {
      type: Number,
    },
    transferMode: {
      type: String,
    },
    transferType: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getAdminModel(AdminDBModel.PendingCashOutRequest);
export default getModel;

// export default model(
//   'PendingCashoutRequest',
//   pendingCashoutRequestSchema,
//   'pendingCashoutRequest',
// );
