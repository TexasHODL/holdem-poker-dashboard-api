import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const bonusdataSchema = new Schema(
  {
    playerId: {
      type: String,
      required: true,
    },
    bonus: {
      type: Array,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getDBModel(PokerDBModel.BonusData);
export default getModel;
// export default model('Bonusdata', bonusdataSchema, 'bonusdata');
