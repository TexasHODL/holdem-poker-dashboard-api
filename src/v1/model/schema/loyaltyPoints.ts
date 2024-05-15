import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const loyaltyPointsSchema = new Schema(
  {
    loyaltyLevel: {
      type: String,
      required: true,
    },
    levelThreshold: {
      type: Number,
      required: true,
    },
    percentReward: {
      type: Number,
      required: true,
    },
    levelId: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getAdminModel(AdminDBModel.LoyaltyPoint);
export default getModel;
// export default model('LoyaltyPoints', loyaltyPointsSchema, 'loyaltyPoints');
