export interface codeNameType {
  codeName: string;
  status: string;
}

export interface BonusCodeType {
  type: string;
}

export interface bonusCodeType {
  bonusCodeType: BonusCodeType;
  status: string;
}

export interface CodeType {
  name: string;
  type: string;
}

export interface LoyaltyLevel {
  name: string;
  level: number;
}

export interface ProfileType {
  name: string;
  level: number;
}
export interface BonusCodePayload {
  validTill: string;
  codeName: string;
  // instantBonusPercent: number;
  // lockedBonusPercent: number;
  // instantCap: number;
  // lockedCap: number;
  bonusCodeType: CodeType;
  bonusCodeCategory: CodeType;
  minAmount: number;
  maxAmount: number;
  loyalityLevel: LoyaltyLevel;
  tag: string;
  tagDescription: string;
  createdBy: string;
  profile: ProfileType;
  status: string;
  totalUsed: number;
  // bonusId: string;
}

export interface RoleType {
  name: string;
  level: number;
}

export interface UpdatePayload {
  updatedBy: string;
  updatedByRole: RoleType;
  tag: string;
  tagDescription?: string;
  validTill: string;
}

export interface IdQueryType {
  _id: string;
}

export interface instantExpireUpdate {
  status: string;
}

export interface addPromoBonusPayload {
  promoCode: string;
  amount: number;
}

export interface ValidPromoQuery {
  username: string;
}
