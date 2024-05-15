import { Schema, model } from 'mongoose';

export const balanceSheetSchema = new Schema(
  {
    deposit: {
      type: Number,
    },
    profit: {
      type: Number,
    },
    bonus: {
      type: Number,
    },
    withdrawal: {
      type: Number,
    },
    instaCashBonus: {
      type: Number,
    },
    instantBonusAmount: {
      type: Number,
    },
    lockedBonusAmount: {
      type: Number,
    },
    lockedBonusReleased: {
      type: Number,
    },
    instantBonusReleased: {
      type: Number,
    },
    leaderboardWinning: {
      type: Number,
    },
    lockedBonusExpiredAmt: {
      type: Number,
    },
    instantChipsPulled: {
      type: Number,
    },
    scratchCardUsed: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export default model('BalanceSheet', balanceSheetSchema, 'balanceSheet');
