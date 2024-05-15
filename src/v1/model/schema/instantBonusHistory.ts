import { Schema, model } from 'mongoose';

export const instantBonusHistorySchema = new Schema(
  {
    userName: {
      type: 'String',
      required: true,
    },
    amount: {
      type: 'Number',
    },
    type: {
      type: 'String',
      required: true,
    },
    time: {
      type: 'Number',
    },
    comments: {
      type: 'String',
    },
    parentUserName: {
      type: 'String',
    },
    promoCode: {
      type: 'String',
    },
    lockedBonusAmount: {
      type: 'Number',
    },
    bonusChipsType: {
      type: 'String',
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export default model(
  'InstantBonusHistory',
  instantBonusHistorySchema,
  'instantBonusHistory',
);
