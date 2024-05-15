import { DBModel } from '@/database/connections/db';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const spamWordsSchema = new Schema(
  {
    blockedWords: {
      type: [String],
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

const getModel = () => getDBModel(DBModel.SpamWord);

export default getModel;

// export default model('SpamWords', spamWordsSchema, 'spamWords');
