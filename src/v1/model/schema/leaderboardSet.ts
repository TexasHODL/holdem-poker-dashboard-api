import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const leaderboardSetSchema = new Schema(
  {
    leaderboardSetName: {
      type: 'String',
    },
    createdAt: {
      type: 'Number',
    },
    leaderboardList: {
      type: ['Mixed'],
    },
    leaderboardSetId: {
      type: 'String',
    },
    onView: {
      type: 'Boolean',
    },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const getModel = () => getAdminModel(AdminDBModel.LeaderboardSet);
export default getModel;
// export default model('LeaderboardSet', leaderboardSetSchema, 'leaderboardSet');
