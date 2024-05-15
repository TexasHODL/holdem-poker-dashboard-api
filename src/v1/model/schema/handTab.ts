import { LogDBModel } from '@/database/connections/constants';
import { getLogModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const handTabSchema = new Schema(
  {
    channelId: {
      type: Schema.Types.ObjectId,
    },
    roundId: {
      type: String,
    },
    handId: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    hands: {
      type: [
        {
          type: {
            type: String,
          },
          rank: {
            type: Number,
          },
          name: {
            type: String,
          },
          priority: {
            type: Number,
          },
        },
      ],
    },
    pot: {
      type: Number,
    },
    handHistoryId: {
      type: Schema.Types.ObjectId,
    },
    videoId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getLogModel(LogDBModel.HandTab);
export default getModel;
// export default model('HandTab', handTabSchema, 'handTab');
