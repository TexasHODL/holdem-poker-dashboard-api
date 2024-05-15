import { getApp } from '@/app';
import { AdminDBModel } from '@/database/connections/constants';
import {
  getAdminModel,
  getAdminModelToken,
} from '@/database/connections/helpers';
import mongoose, { Schema } from 'mongoose';
export const { String, Boolean, Mixed } = Schema.Types;
export const moduleAffiliatesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    code: {
      type: Number,
    },
    iconClass: {
      type: String,
    },
    status: {
      type: Boolean,
    },
    subModule: {
      type: [Mixed],
    },
  },
  {
    collection: 'moduleAffiliates',
    strict: false,
  },
);
// export const moduleAffiliates = mongoose.model(
//   'moduleAffiliates',
//   moduleAffiliatesSchema,
// );
// export default moduleAffiliates;

export const getModel = () => getAdminModel(AdminDBModel.ModuleAffiliate);
export default getModel;
