import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const scheduleTaskSchema = new Schema(
  {
    type: {
      type: String,
    },
    createdBy: {
      name: {
        type: String,
      },
      userName: {
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
      id: {
        type: String,
      },
    },
    serverDownTime: {
      type: Number,
    },
    serverUpTime: {
      type: Number,
    },
    disableGameStartTime: {
      type: Number,
    },
    disableLoginTime: {
      type: Number,
    },
    status: {
      type: String,
    },
    logs: {
      type: [String],
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getDBModel(PokerDBModel.ScheduleTask);
export default getModel;
// export default model('ScheduleTasks', scheduleTaskSchema, 'scheduleTasks');
