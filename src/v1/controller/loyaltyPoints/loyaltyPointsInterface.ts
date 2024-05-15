export interface LoyaltyPointsPayload {
  loyaltyLevel: string;
  levelThreshold: number;
  percentReward: number;
  levelId?: number;
}

export interface paramsPayload {
  success: boolean;
  result: string | LoyaltyPointsPayload;
}

export interface updateLoyaltyPointsPayload {
  _id: string;
  loyaltyLevel: string;
  levelThreshold: number;
  percentReward: number;
  levelId: number;
  updatedAt?: string;
}

export interface FindQuery {
  loyaltyLevel: string | object;
}

export interface updateQuery {
  loyaltyLevel: string;
  levelThreshold: number;
  percentReward: number;
  levelId: number;
}
