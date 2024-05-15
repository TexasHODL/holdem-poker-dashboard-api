import {
  addPromoBonusPayload,
  BonusCodePayload,
  UpdatePayload,
} from './bonusCodeInterface';

export const BonusCodePayloadType: BonusCodePayload = {
  validTill: '',
  codeName: '',
  // instantBonusPercent: 0,
  // lockedBonusPercent: 0,
  // instantCap: 0,
  // lockedCap: 0,
  bonusCodeType: { name: '', type: '' },
  bonusCodeCategory: { name: '', type: '' },
  minAmount: 0,
  maxAmount: 0,
  loyalityLevel: { name: '', level: 1 },
  tag: '',
  tagDescription: '',
  createdBy: '',
  profile: { name: '', level: 0 },
  status: '',
  totalUsed: 0,
  // bonusId: '',
} as BonusCodePayload;

export const updateBonusRequest: UpdatePayload = {
  updatedBy: '',
  updatedByRole: { name: '', level: 0 },
  tag: '',
  tagDescription: '',
  validTill: '',
};

export const addPromoBonusRequest: addPromoBonusPayload = {
  promoCode: '',
  amount: 0,
};
