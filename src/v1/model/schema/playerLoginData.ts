import { LogDBModel } from '@/database/connections/constants';
import { getLogModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const playerLoginDataSchema = new Schema(
  {
    endDate: {
      type: Number,
    },
    startDate: {
      type: Number,
    },
    playerCount: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getLogModel(LogDBModel.PlayerLoginData);
export default getModel;
// export default model(
//   'PlayerLoginData',
//   playerLoginDataSchema,
//   'playerLoginData',
// );
