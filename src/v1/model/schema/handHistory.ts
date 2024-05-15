import { LogDBModel } from '@/database/connections/constants';
import { getLogModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const handHistorySchema = new Schema(
  {
    channelId: {
      type: Schema.Types.ObjectId,
    },
    handId: {
      type: String,
    },
    tableName: {
      type: String,
    },
    tableVariation: {
      type: String,
    },
    stakes: {
      type: String,
    },
    players: {
      type: [String],
    },
    playerInfo: {
      type: [
        {
          playerName: {
            type: String,
          },
          ip: {
            type: String,
          },
        },
      ],
    },
    roundId: {
      type: String,
    },
    roundCount: {
      type: Number,
    },
    startedAt: {
      type: Number,
    },
    finishedAt: {
      type: Number,
    },
    historyLog: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getLogModel(LogDBModel.HandHistory);
export default getModel;
// export default model('HandHistory', handHistorySchema, 'handHistory');
