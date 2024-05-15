import { AdminDBModel, PokerDBModel } from '@/database/connections/constants';
import { getAdminModel, getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const promoBonusSchema = new Schema(
  {
    promoCode: {
      type: String,
    },
    amount: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
    strict: false,
  },
);

// export default model('PromoBonus', promoBonusSchema, 'promoBonus');
export const getModel = () => getAdminModel(AdminDBModel.PromoBonus);
export default getModel;
