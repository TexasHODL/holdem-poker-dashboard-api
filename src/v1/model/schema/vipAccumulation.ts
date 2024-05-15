import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const vipAccumulationSchema = new Schema(
  {
    date: {
      type: Number,
    },
    userName: {
      type: String,
    },
    playerId: {
      type: String,
    },
    rakeAmount: {
      type: Number,
    },
    megaPointLevel: {
      type: Number,
    },
    megaPoints: {
      type: Number,
    },
    earnedPoints: {
      type: Number,
    },
    channelName: {
      type: String,
    },
    channelId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getDBModel(PokerDBModel.VipAccumulation);
export default getModel;
// export default model(
//   'VipAccumulation',
//   vipAccumulationSchema,
//   'vipAccumulation',
// );
