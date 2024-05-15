import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const rakebackPlayerHistorySchema = new Schema(
  {
    from: {
      type: Date,
    },
    to: {
      type: Date,
    },
    userName: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    totalRakeBackFirstLine: {
        type: Number,
    },
    totalRakeBackSecondLine: {
        type: Number,
    },
    previousAmount: {
        type: Number,
    },
    nextAmount: {
        type: Number,
    },
    isFirstLineApproved: {
        type: Boolean,    
    },
    isSecondLineApproved: {
        type: Boolean
    },
    status: {
        type: String
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getAdminModel(AdminDBModel.RakebackPlayerHistory);
export default getModel;

// export default model(
//   'TransactionHistory',
//   transactionHistorySchema,
//   'transactionHistory',
// );
