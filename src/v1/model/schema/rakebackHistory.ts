import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const rakebackHistorySchema = new Schema(
  {
    from: {
        type: Date,
    },
    to: {
        type: Date,
    },
    createdAt: {
       type: Date 
    }
  },
//   {
//     versionKey: false,
//     timestamps: { createdAt: true, updatedAt: true },
//     strict: false,
//   },
);

export const getModel = () => getAdminModel(AdminDBModel.RakebackHistory);
export default getModel;