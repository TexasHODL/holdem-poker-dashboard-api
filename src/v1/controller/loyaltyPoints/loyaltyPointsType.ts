import {
  LoyaltyPointsPayload,
  updateLoyaltyPointsPayload,
} from './loyaltyPointsInterface';

export const loyaltyPayload: LoyaltyPointsPayload = {
  loyaltyLevel: '',
  levelThreshold: 0,
  percentReward: 0,
};

export const updateLoyaltyPayload: updateLoyaltyPointsPayload = {
  _id: '',
  loyaltyLevel: '',
  levelThreshold: 0,
  percentReward: 5,
  levelId: 1,
  updatedAt: '',
};
