import { getApp } from '@/app';
import { AdminDBModel } from '@/database/connections/constants';
import {
  getAdminModel,
  getAdminModelToken,
} from '@/database/connections/helpers';
import mongoose, { Schema } from 'mongoose';
export const { String, Boolean, Date } = Schema.Types;
export const affiliatesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Number,
    },
    mobile: {
      type: Number,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    role: {
      name: {
        type: String,
      },
      level: {
        type: Number,
      },
    },
    roles: {
      type: String,
    },
    status: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    password: {
      type: String,
    },
    chipsManagement: {
      deposit: {
        type: Number,
      },
      withdrawl: {
        type: Number,
      },
      withdrawlCount: {
        type: Number,
      },
      profitCount: {
        type: Number,
      },
    },
    rakeCommision: {
      type: Number,
    },
    realChips: {
      type: Number,
    },
    profit: {
      type: Number,
    },
    withdrawal: {
      type: Number,
    },
    module: {
      type: Array,
    },
    isAuthenticatorEnabled: {
      type: String,
    },
    secret: {
      type: String
    }
  },
  { collection: 'affiliates', strict: false },
);

export const getModel = () => getAdminModel(AdminDBModel.Affiliates);
export default getModel;
