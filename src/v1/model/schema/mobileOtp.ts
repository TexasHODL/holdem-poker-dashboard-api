import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const mobileOtpSchema: Schema = new Schema(
  {
    mobileNumber: {
      type: String,
    },
    otp: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export const getModel = () => getDBModel(PokerDBModel.User);
export default getModel;
// export default model('MobileOtp', mobileOtpSchema, 'mobileOtp');
