import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const playerRakeBackSchema = new Schema(
  {
    rakeByUsername: {
      type: String,
    },
    addedDate: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    amountGST: {
      type: Number,
    },
    emailId: {
      type: String,
    },
    handsPlayed: {
      type: Number,
    },
    parentUser: {
      type: String,
    },
    playerRakeBack: {
      type: Number,
    },
    rakeBack: {
      type: Number,
    },
    rakeByName: {
      type: String,
    },
    rakeByUserid: {
      type: String,
    },
    referenceNumber: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getAdminModel(AdminDBModel.Passbook);
export default getModel;
// export default model('PlayerRakeBack', playerRakeBackSchema, 'playerRakeBack');
