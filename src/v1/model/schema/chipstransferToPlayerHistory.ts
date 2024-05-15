import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const chipstransferToPlayerHistorySchema = new Schema(
  {
    transferTo: {
      type: String,
    },
    amount: {
      type: Number,
    },
    transferBy: {
      type: String,
    },
    referenceNoAff: {
      type: String,
    },
    transactionType: {
      type: String,
    },
    description: {
      type: String,
    },
    date: {
      type: Number,
    },
    role: {
      name: {
        type: String,
      },
      level: {
        type: Number,
      },
    },
    names: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () =>
  getAdminModel(AdminDBModel.ChipstransferToPlayerHistory);
export default getModel;

// export default model(
//   'ChipstransferToPlayerHistory',
//   chipstransferToPlayerHistorySchema,
//   'chipstransferToPlayerHistory',
// );
