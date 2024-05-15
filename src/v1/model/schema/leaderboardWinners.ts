import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const leaderboardWinnerSchema = new Schema(
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
    minVipPoints: {
      type: Number,
    },
    minHands: {
      type: Number,
    },
    noOfWinners: {
      type: Number,
    },
    totalPrizePool: {
      type: Number,
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
    startTime: {
      type: Number,
    },
    endTime: {
      type: Number,
    },
    participantsArray: {
      type: [
        {
          _id: {
            userName: {
              type: String,
            },
            pId: {
              type: String,
            },
          },
          total: {
            type: Number,
          },
          myCount: {
            type: Number,
          },
          parentName: {
            type: String,
          },
          amountWon: {
            type: Number,
          },
          rank: {
            type: String,
          },
          email: {
            type: String,
          },
          mobile: {
            type: String,
          },
        },
      ],
    },
    expectedWinners: {
      type: [
        {
          _id: {
            userName: {
              type: String,
            },
            pId: {
              type: String,
            },
          },
          total: {
            type: Number,
          },
          myCount: {
            type: Number,
          },
          parentName: {
            type: String,
          },
          amountWon: {
            type: Number,
          },
          rank: {
            type: String,
          },
          email: {
            type: String,
          },
          mobile: {
            type: String,
          },
        },
      ],
    },
    winnerDeclared: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getDBModel(PokerDBModel.LeaderboardWinners);
export default getModel;
// export default model(
//   'LeaderboardWinners',
//   leaderboardWinnerSchema,
//   'leaderboardWinners',
// );
