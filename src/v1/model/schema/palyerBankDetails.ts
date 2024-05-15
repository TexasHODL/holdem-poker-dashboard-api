import { Schema, model } from 'mongoose';

export const palyerBankDetailsSchema = new Schema(
    {
        createdBy: {
            type: String,
        },
        updatedBy: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: { createdAt: true, updatedAt: true },
        strict: false,
    },
);

export default model('palyerBankDetails', palyerBankDetailsSchema, 'palyerBankDetails');
