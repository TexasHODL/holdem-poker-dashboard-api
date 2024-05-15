import { getApp } from '@/app';
import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const userSessionSchema = new Schema(
  {
    playerId: {
      type: String,
    },
    serverId: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

// const getModel = () => {
//   return getApp().get(getAdminModelToken(AdminDBModel.Fundrake))
// };

// export default getModel;
export const getModel = () => getDBModel(PokerDBModel.UserSession);
export default getModel;
// export default model('UserSession', userSessionSchema, 'userSession');
