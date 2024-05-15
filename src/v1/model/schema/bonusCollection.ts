import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const bonusCollectionSchema = new Schema(
  {
    validTill: {
      type: Number,
    },
    codeName: {
      type: String,
    },
    instantBonusPercent: {
      type: Number,
    },
    lockedBonusPercent: {
      type: Number,
    },
    instantCap: {
      type: Number,
    },
    lockedCap: {
      type: Number,
    },
    bonusCodeType: {
      name: {
        type: String,
      },
      type: {
        type: String,
      },
    },
    bonusCodeCategory: {
      name: {
        type: String,
      },
      type: {
        type: String,
      },
    },
    minAmount: {
      type: Number,
    },
    maxAmount: {
      type: Number,
    },
    loyalityLevel: {
      name: {
        type: String,
      },
      level: {
        type: Date,
      },
    },
    tag: {
      type: String,
    },
    tagDescription: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    profile: {
      name: {
        type: String,
      },
      level: {
        type: Number,
      },
    },
    status: {
      type: String,
    },
    totalUsed: {
      type: Number,
    },
    bonusId: {
      type: String,
    },
    usedInLeaderboard: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

// export default model(
//   'BonusCollection',
//   bonusCollectionSchema,
//   'bonusCollection',
// );

export const getModel = () => getAdminModel(AdminDBModel.BonusCollection);
export default getModel;