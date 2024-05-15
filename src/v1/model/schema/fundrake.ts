import mongoose, { Schema, model } from 'mongoose';
import { getApp } from '@/app';
import {
  getAdminModel,
  getAdminModelToken,
  getFinanceModel,
} from '@/database/connections/helpers';
import { AdminDBModel, FinanceDbModel } from '@/database/connections/constants';

export const fundrakeSchema = new Schema(
  {
    rakeRefType: {
      type: String,
    },
    rakeRefVariation: {
      type: String,
    },
    channelId: {
      type: String,// mongoose.Schema.Types.ObjectId,
    },
    channelName: {
      type: String,
    },
    rakeRefSubType: {
      type: String,
    },
    rakeRefId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    transactionid: {
      type: String,
    },
    rakeByUserid: {
      type: String,
    },
    rakeByName: {
      type: String,
    },
    megaCircle: {
      type: Number,
    },
    megaPoints: {
      type: Number,
    },
    rakeByUsername: {
      type: String,
    },
    amount: {
      type: Number,
    },
    amountGST: {
      type: Number,
    },
    debitToCompany: {
      type: Number,
    },
    debitToAffiliateid: {
      type: mongoose.Schema.Types.ObjectId,
    },
    debitToAffiliatename: {
      type: String,
    },
    debitToAffiliateamount: {
      type: Number,
    },
    playerRakeBack: {
      type: Number,
    },
    playerRakeBackPercent: {
      type: Number,
    },
    addeddate: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getFinanceModel(FinanceDbModel.Fundrake);
export default getModel;
// export default model('Fundrake', fundrakeSchema, 'fundrake');
