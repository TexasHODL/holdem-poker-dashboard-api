import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const leaderboardParticipantSchema = new Schema(
  {
    leaderboardId: {
      type: String,
    },
    leaderboardName: {
      type: String,
    },
    participantArray: {
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
        },
      ],
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getDBModel(PokerDBModel.LeaderboardParticipant);
export default getModel;
// export default model(
//   'LeaderboardParticipant',
//   leaderboardParticipantSchema,
//   'leaderboardParticipant',
// );
