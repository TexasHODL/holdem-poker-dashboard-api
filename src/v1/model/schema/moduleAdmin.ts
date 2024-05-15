import { getApp } from '@/app';
import { AdminDBModel } from '@/database/connections/constants';
import {
  getAdminModel,
  getAdminModelToken,
} from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';
export const { String, Boolean, Mixed } = Schema.Types;
export const moduleAdminSchema = new Schema(
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
      type: [
        {
          name: {
            type: String,
          },
          code: {
            type: Number,
          },
          route: {
            type: String,
          },
          iconClass: {
            type: String,
          },
          status: {
            type: Boolean,
          },
        },
      ],
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getAdminModel(AdminDBModel.ModuleAdmin);
export default getModel;
// export default model('ModuleAdmin', moduleAdminSchema, 'moduleAdmin');
