import {
  createScratchCardAffiliatePayload,
  ScratchCardHighRollersPayload,
} from './scratchCardInterface';

export const createScratchCardAffiliateRequest: createScratchCardAffiliatePayload =
  {
    scratchCardDetails: [{ denomination: 0, quantity: 0 }],
    scratchCardType: '',
    affiliateId: '',
    totalAmount: 0,
    isActive: false,
    expiresOn: '',
    transactionType: '',
    createdBy: {
      name: '',
      userName: '',
      role: {
        name: '',
        level: 0,
      },
      id: '',
    },
  };

export const ScratchCardHighRollersRequest: ScratchCardHighRollersPayload = {
  playerId: '',
  totalAmount: 0,
  expiresOn: '',
  transactionType: '',
  comment: '',
  scratchCardType: '',
  isActive: false,
  createdBy: {
    name: '',
    userName: '',
    role: {
      name: '',
      level: 0,
    },
    id: '',
  },
};
