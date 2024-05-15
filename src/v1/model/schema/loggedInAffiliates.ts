import { getApp } from '@/app';
import { AdminDBModel } from '@/database/connections/constants';
import {
  getAdminModel,
  getAdminModelToken,
} from '@/database/connections/helpers';
import mongoose, { Schema } from 'mongoose';
export const { String, Boolean, Mixed } = Schema.Types;
export const loggedInAffiliatesSchema = new mongoose.Schema(
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
    role: {
      name: {
        type: String,
      },
      level: {
        type: Number,
      },
    },
    timestamp: {
      type: Number,
    },
    token: {
      type: String,
    },
    isParent: {
      type: String,
    },
    loggedinUserMobileNum: {
      type: Number,
    },
    moduleAccess: {
      type: Mixed,
    },
    department: {
      type: String,
    },
    uniqueSessionId: {
      type: String,
    },
  },
  {
    collection: 'loggedInAffiliates',
    strict: false,
  },
);
// export const loggedInAffiliates = mongoose.model(
//   'loggedInAffiliates',
//   loggedInAffiliatesSchema,
// );
// export default loggedInAffiliates;
export const getModel = () => getAdminModel(AdminDBModel.LoggedInAffiliate);
export default getModel;
