import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const rakebackConfigurationSchema = new Schema(
  {
    toAdminPercent: {
        type: Number,
    },
    to1stLinePercent: {
        type: Number,
    },
    to2ndLinePercent: {
        type: Number,
    },
    target1stLine: {
        type: String,
    },
    target2ndLine: {
        type: String,
    },
    timeDurationCycle: {
        type: String,
    },
    daysOfWeek: {
        type: String,
    },
    hours: {
        type: String,
    },
    minutes: {
        type: String,
    }
  },
//   {
//     versionKey: false,
//     timestamps: { createdAt: true, updatedAt: true },
//     strict: false,
//   },
);

export const getModel = () => getAdminModel(AdminDBModel.RakebackConfiguration);
export default getModel;

// export default model(
//   'TransactionHistory',
//   transactionHistorySchema,
//   'transactionHistory',
// );
