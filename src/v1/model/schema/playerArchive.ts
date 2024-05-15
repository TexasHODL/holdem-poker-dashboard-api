import { Schema, model } from 'mongoose';

export const playerArchiveSchema = new Schema(
  {
    timestamp: {
      type: Number,
    },
    playerId: {
      type: String,
    },
    userName: {
      type: String,
    },
    realChips: {
      type: Number,
    },
    megaPoints: {
      type: Number,
    },
    megaPointLevel: {
      type: Number,
    },
    handsWon: {
      type: Number,
    },
    handsPlayed: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export default model('PlayerArchive', playerArchiveSchema, 'playerArchive');
