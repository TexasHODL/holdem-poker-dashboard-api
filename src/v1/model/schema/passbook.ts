import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const passbookSchema = new Schema(
  {
    playerId: {
      type: String,
    },
    history: {
      type: [
        {
          time: {
            type: Number,
          },
          category: {
            type: String,
          },
          prevAmt: {
            type: Number,
          },
          amount: {
            type: Number,
          },
          newAmt: {
            type: Number,
          },
          subCategory: {
            type: String,
          },
          tableName: {
            type: String,
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

// export default model('Passbook', passbookSchema, 'passbook');
export const getModel = () => getAdminModel(AdminDBModel.Passbook);
export default getModel;
