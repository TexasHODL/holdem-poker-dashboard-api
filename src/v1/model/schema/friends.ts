import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const friendsSchema = new Schema(
  {
    playerId: {
      type: String,
      required: true,
    },
    requestReceived: {
      type: Array,
    },
    friends: {
      type: Array,
    },
    requestSent: {
      type: Array,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getDBModel(PokerDBModel.Friend);
export default getModel;
// export default model('Friends', friendsSchema, 'friends');
