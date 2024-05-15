import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const leaderboardSchema = new Schema(
  {
    leaderboardId: {
      type: String,
    },
    leaderboardName: {
      type: String,
    },
    leaderboardType: {
      type: String,
    },
    startTime: {
      type: Number,
    },
    endTime: {
      type: Number,
    },
    status: {
      type: String,
    },
    minVipPoints: {
      type: Number,
    },
    minHands: {
      type: Number,
    },
    noOfWinners: {
      type: Number,
    },
    createdBy: {
      name: {
        type: String,
      },
      level: {
        type: Number,
      },
    },
    tables: {
      type: [
        {
          _id: {
            type: Schema.Types.ObjectId,
          },
          channelName: {
            type: String,
          },
          smallBlind: {
            type: Number,
          },
          bigBlind: {
            type: Number,
          },
        },
      ],
    },
    payout: {
      type: [Number],
    },
    termsCondition: {
      type: Array,
    },
    totalPrizePool: {
      type: Number,
    },
    usedInSet: {
      type: Boolean,
    },
    percentAccumulation: {
      type: Number,
    },
    description: {
      type: String,
    },
    minRake: {
      type: Number,
    },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
  },
);
export const getModel = () => getAdminModel(AdminDBModel.Leaderboard);
export default getModel;
// export default model('Leaderboard', leaderboardSchema, 'leaderboard');
