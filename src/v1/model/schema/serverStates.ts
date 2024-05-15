import { Schema, model } from 'mongoose';

export const serverStateSchema = new Schema(
  {
    serverId: {
      type: Date,
    },
    type: {
      type: String,
    },
    disableGameStart: {
      status: {
        type: String,
      },
      byScheduleId: {
        type: String,
      },
      timestamp: {
        type: Number,
      },
    },
    disableLogin: {
      status: {
        type: String,
      },
      byScheduleId: {
        type: String,
      },
      timestamp: {
        type: Number,
      },
    },
    disableJoin: {
      status: {
        type: String,
      },
      byScheduleId: {
        type: String,
      },
      timestamp: {
        type: Number,
      },
    },
    disableSit: {
      status: {
        type: String,
      },
      byScheduleId: {
        type: String,
      },
      timestamp: {
        type: Number,
      },
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export default model('ServerStates', serverStateSchema, 'serverStates');
