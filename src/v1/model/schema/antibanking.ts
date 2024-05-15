import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const antibankingSchema = new Schema(
  {
    playerId: {
      type: String,
      required: true,
    },
    channelId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    expireAt: {
      type: Number,
    },
    amount: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getDBModel(PokerDBModel.Antibanking);
export default getModel;
// export default model('Antibanking', antibankingSchema, 'antibanking');
