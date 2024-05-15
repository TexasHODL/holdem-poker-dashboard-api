import { Mixed } from 'mongoose';

/***** createScratchCardAffiliate  interfaces *****/

export interface scratchCardDetailsType {
  denomination: number;
  quantity: number;
}

export interface roleType {
  name: string;
  level: number;
}
export interface createdByType {
  name: string;
  userName: string;
  role: roleType;
  id: string;
}

export interface createScratchCardAffiliatePayload {
  scratchCardDetails: scratchCardDetailsType[];
  scratchCardType: string;
  affiliateId: string;
  totalAmount: number;
  isActive: boolean;
  expiresOn: string;
  transactionType: string;
  createdBy: createdByType;
}

export interface saveScratchCardAffiliateDetails {
  scratchCardDetails: scratchCardDetailsType[];
  scratchCardType: string;
  affiliateId: string;
  totalAmount: number;
  isActive: boolean;
  expiresOn: string;
  transactionType: string;
  createdBy: createdByType;
  userLevel: string;
  emailId: string;
  affiliateDetail: Mixed;
  comment: string;
}

export interface findUserQuery {
  userName: string;
}

/***** ScratchCard HighRollers interfaces *****/

export interface ScratchCardHighRollersPayload {
  playerId: string;
  totalAmount: number;
  expiresOn: string;
  transactionType: string;
  comment: string;
  scratchCardType: string;
  isActive: boolean;
  createdBy: createdByType;
}

/***** reject ScratchCard interfaces *****/

export interface rejectScratchCardData {
  code?: string;
  scratchCardType?: string;
  scratchCarddetails?: scratchCardDetailsType[];
  detailString?: string;
  denomination?: number;
  expiresOn?: string;
  transactionType?: string;
  createdBy?: createdByType;
  status?: string;
  reasonOfRejection?: string;
  usedBy?: string;
  issuedBy?: createdByType;
  promoCode?: string;
  affiliateId?: string;
  userLevel?: string;
  playerId?: string;
  comment?: string;
  generationId?: string;
}

export interface deleteQuery {
  _id: string;
}

export interface approveScratchCardData {
  code?: string;
  scratchCardType?: string;
  denomination?: number;
  expiresOn?: string;
  createdBy?: createdByType;
  transactionType?: string;
  issuedBy?: createdByType;
  status?: string;
  generationId?: string;
  promoCode?: string;
  affiliateId?: string;
  userLevel?: string;
  playerId?: string;
  receiverMail?: string;
  playerName?: string;
  comment?: string;
  info?: string;
}

export interface createDepositQueryType {
  name?: string;
  loginId?: string;
  userLevel?: string;
  scratchCardType?: string;
  date?: Date;
  referenceNumber?: string;
  amount?: number;
  transferMode?: string;
  paymentId?: string;
  bonusCode?: string;
  bonusAmount?: string;
  transactionType?: string;
  transferTo?: string;
  approvedBy?: string;
  status?: string;
  profileScratchCard?: string;
}

export interface ContentType {
  name?: string;
  userName?: string;
  scratchCardDetails?: string;
}

export interface sendParamsType {
  content: ContentType;
  to_email: string;
  from_email: string;
  subject: string;
  template?: string;
}

export interface findPlayerQuery {
  emailId: string;
}

export interface detailsType {
  denomination: number;
  quantity: number;
}

export interface playerDetail {
  _id?: string;
  password: string;
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  emailId?: string;
  mobileNumber?: string;
  userName?: string;
  isOrganic: boolean;
  ipV4Address?: string;
  ipV6Address?: string;
  profileImage?: string;
  deviceType?: string;
  loginMode?: string;
  googleObject?: string;
  facebookObject?: string;
  isParent?: string;
  isParentUserName?: string;
  parentType?: string;
  playerId: string;
  createdAt?: string;
  address?: Mixed;
  statistics: Mixed;
  prefrences: Mixed;
  settings: Mixed;
  buildAccess: Mixed;
  isEmailVerified: boolean;
  isMobileNumberVerified: boolean;
  isNewUser: boolean;
  isBlocked: boolean;
  status: string;
  isMuckHand: boolean;
  dailyBonusCollectionTime: string;
  previousBonusCollectedTime: string;
  lastLogin: string;
  profilelastUpdated: string;
  freeChips: string;
  realChips: string;
  instantBonusAmount: string;
  claimedInstantBonus: string;
  passwordResetToken: string;
  isResetPasswordTokenExpire: string;
  emailVerificationToken: string;
  isEmailVerificationTokenExpire: true;
  loyalityRakeLevel: string;
  isBot: false;
  offers: Mixed;
  chipsManagement: Mixed;
  rakeBack: number;
  favourateTable: Mixed;
  totalLeaderboardWinnings: string;
  affiliateEmail: string;
  affiliateMobile: string;
  claimedBonusAmount: number;
  hours: number;
  lastActiveTime: string;
  loggedInUser: string;
  name: string;
  noOfDays: number;
  playerParentHistoryData: Mixed;
  totalAvailableChips: number;
  unclaimedBonusAmount: number;
  userRole: roleType;
}

export interface affiliateDetail {
  role: roleType;
  chipsManagement: Mixed;
  _id?: string;
  name: string;
  userName: string;
  email: string;
  gender: string;
  dob: number;
  mobile: number;
  address: string;
  city: string;
  state: string;
  country: string;
  roles: string;
  status: string;
  pincode: number;
  password: string;
  rakeCommision: number;
  realChips: number;
  profit: number;
  withdrawal: number;
}

export interface approveScratchCardPayload {
  _id: string;
  scratchCardType: string;
  scratchCardDetails: scratchCardDetailsType;
  totalAmount: number;
  isActive: boolean;
  expiresOn: string;
  affiliateId: string;
  createdBy: createdByType;
  transactionType: string;
  userLevel: string;
  emailId: string;
  affiliateDetail?: affiliateDetail;
  comment?: string;
  issuedBy: createdByType;
  createdAt?: string;
  updatedAt?: string;
  playerId?: string;
  index?: string;
  playerDetail?: playerDetail;
  promoCode?: string;
  recieverMail?: string;
  playerName?: string;
}

export interface BalanceSheetQueryType {
  $inc: { bonus: number } | { deposit: number };
}

export interface updateDepositQuery {
  $inc: { 'chipsManagement.deposit': number };
}

export interface simpleMailParamsType {
  content: string;
  from_email: string;
  to_email: string;
  subject: string;
}
