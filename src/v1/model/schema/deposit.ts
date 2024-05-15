import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const depositSchema = new Schema(
  {
    userName: {
      type: String,
    },
    loginId: {
      type: String,
    },
    createdAt: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    status: {
        type: String,
    },
    invoiceId: {
        type: String,
    },
    userId: {
        type: String
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getAdminModel(AdminDBModel.Deposit);
export default getModel;

// export default model(
//   'TransactionHistory',
//   transactionHistorySchema,
//   'transactionHistory',
// );
