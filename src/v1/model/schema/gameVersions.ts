import { Schema, model } from 'mongoose';

export const gameVersionSchema = new Schema(
  {
    appVersion: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    maintenanceState: {
      type: String,
      required: true,
    },
    isUpdateRequired: {
      type: Boolean,
    },
    isInMaintainance: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export default model('GameVersions', gameVersionSchema, 'gameVersions');
