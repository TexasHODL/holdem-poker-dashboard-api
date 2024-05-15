import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const playerChatSchema = new Schema(
  {
    playerName: {
      type: String,
    },
    playerId: {
      type: String,
    },
    text: {
      type: String,
    },
    channelId: {
      type: String,
    },
    time: {
      type: Number,
    },
    channelName: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getDBModel(PokerDBModel.PlayerChat);
export default getModel;
// export default model('PlayerChat', playerChatSchema, 'playerChat');
