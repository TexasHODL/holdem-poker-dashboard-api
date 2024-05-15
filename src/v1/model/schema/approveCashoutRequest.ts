import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const approveCashoutSchema = new Schema(
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
    realName: {
      type: String,
    },
    userName: {
      type: String,
    },
    emailId: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifcsCode: {
      type: String,
    },
    bankName: {
      type: String,
    },
    branchName: {
      type: String,
    },
    affiliateId: {
      type: String,
    },
    affiliateMobile: {
      type: Number,
    },
    profile: {
      type: String,
    },
    accountType: {
      type: String,
    },
    referenceNo: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    requestedAt: {
      type: Number,
    },
    currentDepositAmount: {
      type: Number,
    },
    processingFees: {
      type: Number,
    },
    transferMode: {
      type: String,
    },
    tdsType: {
      type: String,
    },
    playerAvailableRealChips: {
      type: Number,
    },
    playerAvailableInstant: {
      type: Number,
    },
    playerVipPoints: {
      type: Number,
    },
    tds: {
      type: Number,
    },
    index: {
      type: Number,
    },
    approveBy: {
      type: String,
    },
    approvedAt: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getAdminModel(AdminDBModel.ApproveCashOutRequest);
export default getModel;
// export default model(
//   'ApproveCashoutRequest',
//   approveCashoutSchema,
//   'approveCashoutRequest',
// );
