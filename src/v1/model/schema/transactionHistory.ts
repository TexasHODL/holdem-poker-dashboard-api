import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const transactionHistorySchema = new Schema(
  {
    Name: {
      type: String,
    },
    loginId: {
      type: String,
    },
    date: {
      type: Number,
    },
    referenceNumber: {
      type: String,
    },
    amount: {
      type: Number,
    },
    transferMode: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    bonusCode: {
      type: String,
    },
    bonusAmount: {
      type: String,
    },
    approvedBy: {
      type: String,
    },
    transactionType: {
      type: String,
    },
    names: {
      type: String,
    },
    loginType: {
      type: String,
    },
    status: {
      type: String,
    },
    megaPointLevel: {
      type: Number,
    },
    megaPoints: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getAdminModel(AdminDBModel.Affiliates);
export default getModel;

// export default model(
//   'TransactionHistory',
//   transactionHistorySchema,
//   'transactionHistory',
// );
