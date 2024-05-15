import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const scratchCardPendingSchema = new Schema(
  {
    scratchCardType: {
      type: String,
    },
    scratchCardDetails: {
      type: [
        {
          denomination: {
            type: Number,
          },
          quantity: {
            type: Number,
          },
        },
      ],
    },
    totalAmount: {
      type: Number,
    },
    isActive: {
      type: Boolean,
    },
    expiresOn: {
      type: Number,
    },
    affiliateId: {
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
    transactionType: {
      type: String,
    },
    userLevel: {
      type: String,
    },
    emailId: {
      type: String,
    },
    affiliateDetail: {
      type: Schema.Types.Mixed,
    },
    playerDetail: {
      type: Schema.Types.Mixed,
    },
    comment: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

// export default model(
//   'ScratchCardPending',
//   scratchCardPendingSchema,
//   'scratchCardPending',
// );

export const getModel = () => getAdminModel(AdminDBModel.ScratchCardPending);
export default getModel;