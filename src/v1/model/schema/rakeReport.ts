import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const rakeReportSchema = new Schema(
  {
    userName: {
      type: String,
    },
    RakeGenerated: {
      type: Number,
    },
    HandId: {
      type: String,
    },
    Timestamp: {
      type: Date,
    },
    GameType: {
        type: String,
    },
    TableName: {
        type: String,
    },
    RakeToAdmin: {
        type: Number,
    },
    RakeTo1StLine: {
        type: Number,
    },
    RakeTo1StLineName: {
        type: String,    
    },
    RakeTo2ndLine: {
        type: Number
    },
    RakeTo2ndLineName: {
        type: String
    },
    playerId: {
        type: String
    },
    tableId: {
        type: String
    },
    isBot: {
        type: Boolean
    },
    timestamp: {
        type: String
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getAdminModel(AdminDBModel.RakeReport);
export default getModel;

// export default model(
//   'TransactionHistory',
//   transactionHistorySchema,
//   'transactionHistory',
// );
