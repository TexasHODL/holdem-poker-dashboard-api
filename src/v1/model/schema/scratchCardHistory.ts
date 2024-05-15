import { AdminDBModel } from '@/database/connections/constants';
import { getAdminModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const scratchCardHistorySchema = new Schema(
  {
    scratchCardDetails: {
      type: Schema.Types.Mixed,
    },
    scratchCardType: {
      type: String,
    },
    detailString: {
      type: String,
    },
    code: {
      type: String,
    },
    playerId: {
      type: String,
    },
    playerName: {
      type: String,
    },
    affiliateId: {
      type: String,
    },
    userLevel: {
      type: String,
    },
    receiverMail: {
      type: Schema.Types.Mixed,
    },
    denomination: {
      type: Number,
    },
    expiresOn: {
      type: Number,
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
    issuedBy: {
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
    status: {
      type: String,
    },
    generationId: {
      type: String,
    },
    usedBy: {
      type: String,
    },
    promoCode: {
      type: String,
    },
    reasonOfRejection: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
  },
);

// export default model(
//   'ScratchCardHistory',
//   scratchCardHistorySchema,
//   'scratchCardHistory',
// );

export const getModel = () => getAdminModel(AdminDBModel.ScratchCardHistory);
export default getModel;