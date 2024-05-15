import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const pendingPasswordResetSchema = new Schema(
  {
    passwordResetToken: {
      type: String,
    },
    playerId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getDBModel(PokerDBModel.PendingPasswordReset);
export default getModel;
// export default model(
//   'PendingPasswordResets',
//   pendingPasswordResetSchema,
//   'pendingPasswordResets',
// );
