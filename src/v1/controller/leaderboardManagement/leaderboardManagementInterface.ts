import { Mixed } from 'mongoose';
import { findLeaderboard } from '../../model/queries/learderboardReport';

export interface getTablesPayload {
  isActive: boolean;
  isRealMoney?: boolean;
  channelType?: string;
}

export interface TableType {
  _id: string;
  channelName: string;
  smallBlind: number;
  bigBlind: number;
}

export interface createdByType {
  name: string;
  level: number;
}

export interface createLeaderboardPayload {
  startTime: string;
  endTime: string;
  leaderboardName: string;
  leaderboardType: string;
  bonusCode?: string;
  bonusId?: string;
  description: string;
  minVipPoints: number;
  minHands: number;
  noOfWinners: number;
  totalPrizePool: number;
  tables: TableType[];
  payout: number[];
  percentAccumulation: number;
  createdBy: createdByType;
}

export interface closedRaceResponseType {
  success: boolean;
  status: number;
  message: string;
  info?: string;
  result?: createLeaderboardPayload | editLeaderboardPayload | any;
}

export interface DataType {
  leaderboardId: string;
  startTime: string;
  endTime: string;
  leaderboardName: string;
  leaderboardType: string;
  bonusCode?: string;
  bonusId?: string;
  status: string;
  description: string;
  minVipPoints: number;
  minHands: number;
  noOfWinners: number;
  totalPrizePool: number;
  tables: TableType[];
  payout: number[];
  percentAccumulation: number;
  createdBy: createdByType;
  usedInSet: boolean;
  termsCondition: [];
  minRake: number;
}

export interface deleteLeaderboardPayload {
  id: string;
  bonusCodeChanged: boolean;
  leaderboardData: leaderboardType;
}

export interface leaderboardType {
  _id: string;
  leaderboardId: string;
  leaderboardName: string;
  leaderboardType: string;
  startTime: string;
  endTime: string;
  status: string;
  minVipPoints: number;
  minHands: number;
  noOfWinners: number;
  createdBy: createdByType;
  tables: TableType[];
  payout: number[];
  description: string;
  termsCondition: [];
  totalPrizePool: number;
  usedInSet: false;
  percentAccumulation: number;
}

export interface editLeaderboardPayload {
  id: string;
  leaderboardName: string;
  leaderboardType: string;
  bonusCode?: string;
  bonusId?: string;
  startTime: string;
  endTime: string;
  description: string;
  minVipPoints: number;
  minHands?: number;
  noOfWinners: number;
  totalPrizePool: number;
  tables: TableType[];
  payout: number[];
  percentAccumulation: number;
  termsCondition: [];
  updatedBy: createdByType;
  updatedAt?: string;
  leaderboardData?: leaderboardType;
}

export interface udpateDataType {
  leaderboardName: string;
  minVipPoints: number;
  minHands: number;
  leaderboardType: string;
  termsCondition: [];
  noOfWinners: number;
  totalPrizePool: number;
  tables: TableType;
  payout: number;
  startTime: string;
  endTime: string;
  updatedBy: createdByType;
  percentAccumulation: number;
  description?: string;
  bonusCode?: string;
  bonusId?: string;
}

export interface udpateQueryType {
  _id: string;
}

export interface directEntryPayload {
  userName: string;
  bonusCode: string;
  playerData?: playerDataType;
}

export interface findUserQuery {
  userName?: string;
  playerId?: string;
}

export interface countDirectEntryHistoryPayload {
  bonusCode: string;
}

export interface findBonusQueryType {
  codeName: string;
  'bonusCodeType.type'?: string;
  bonusCodeCategoryType?: string;
  status?: string;
}

export interface findBonusQuery {
  codeName: string;
  bonusCodeCategoryType: string;
}

export interface bonusDetailsType {
  success: boolean;
  status: number;
  message: string;
  info?: string;
  result?: Mixed;
}

export interface playerDataType {
  _id: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  emailId: string;
  mobileNumber: '';
  userName: string;
  isOrganic: boolean;
  ipV4Address: string;
  ipV6Address: string;
  profileImage: string;
  deviceType: string;
  loginMode: string;
  googleObject: string;
  facebookObject: string;
  isParent: string;
  isParentUserName: string;
  parentType: string;
  playerId: string;
  createdAt?: string;
  address: Mixed;
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
  freeChips: number;
  realChips: number;
  instantBonusAmount: number;
  claimedInstantBonus: number;
  passwordResetToken: string;
  isResetPasswordTokenExpire: string;
  emailVerificationToken: string;
  isEmailVerificationTokenExpire: boolean;
  loyalityRakeLevel: number;
  isBot: boolean;
  offers: boolean[];
  tournaments: boolean[];
  letter: boolean[];
  anouncement: boolean[];
  chipsManagement: Mixed;
  rakeBack: number;
  favourateTable: [];
  totalLeaderboardWinnings: number;
  affiliateEmail: string;
  affiliateMobile: number;
  claimedBonusAmount: number;
  hours: number;
  lastActiveTime: string;
  loggedInUser: string;
  name: string;
  noOfDays: number;
  playerParentHistoryData: Mixed;
  totalAvailableChips: number;
  unclaimedBonusAmount: number;
  userRole: createdByType;
}

export interface findPlayerBonusQueryType {
  playerId: string;
}

export interface countDirectEntryHistoryPayload {
  bonusCode: string;
}

export interface BonusCodeType {
  name: string;
  type: string;
}

export interface BonusCodeCategoryType {
  name: string;
  type: string;
}

export interface LoyalityLevelType {
  name: string;
  level: string;
}

export interface ProfileType {
  name: string;
  level: number;
}

export interface BonusDetailsType {
  bonusCodeType: BonusCodeType;
  bonusCodeCategory: BonusCodeCategoryType;
  loyalityLevel: LoyalityLevelType;
  profile: ProfileType;
  _id: string;
  validTill: string;
  codeName: string;
  instantBonusPercent: number;
  lockedBonusPercent: number;
  minAmount: number;
  maxAmount: number;
  tag: string;
  tagDescription: string;
  createdBy: string;
  status: string;
  totalUsed: number;
  bonusId: string;
  usedInLeaderboard: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface playerDirectEntryDataType {
  bonusId: string;
  name: string;
  unClaimedBonus: number;
  instantBonusAmount: number;
  claimedBonus: number;
  uniqueId: string;
  fromBackedn: boolean;
  expireStatus: number;
  expiredAmt: number;
  expireAt: string;
}

export interface playerBonusDataArrayType {
  _id: string;
  playerId: string;
  bonus: playerDirectEntryDataType[];
  userName?: string;
}

export interface playerBonusDataType {
  _id: string;
  playerId: string;
  bonus: playerDirectEntryDataType[];
  userName?: string;
}

export interface directEntryHistoryPayload {
  skip: number;
  limit: number;
  bonusCode: string;
  bonusData?: BonusDetailsType;
  playerBonusData?: playerBonusDataType[] | any;
}

export interface directEntryUdpateQueryType {
  bonus: playerDirectEntryDataType;
}

export interface bonusUsedbyPlayerQuery {
  skip?: number;
  limit?: number;
  bonusId: string;
}

export interface leaderboardParticipantsPayload {
  leaderboardId: string;
  status: string;
  participantsArray?: any[];
  leaderboardData?: leaderboardDataPayload;
  crossedVipCount?: number;
  playerBonusList?: any[];
  showMessage?: boolean;
}

export interface findLeaderboardQuery {
  leaderboardId: string;
}

export interface findParticipantParamsType {
  leaderboardData: leaderboardDataPayload;
  playerBonusList?: any[];
}

export interface leaderboardDataPayload {
  _id: string;
  leaderboardId: string;
  leaderboardName: string;
  leaderboardType: string;
  startTime: string;
  endTime: string;
  status: string;
  minVipPoints: number;
  minHands: number;
  noOfWinners: number;
  createdAt: string;
  createdBy: createdByType;
  tables: TableType[];
  payout: number[];
  description: string;
  termsCondition: string[];
  totalPrizePool: number;
  usedInSet: boolean;
  percentAccumulation: number;
  bonusCode: string;
  bonusId: string;
  minRake: number;
  updatedAt: string;
  updatedBy: createdByType;
}

export interface IdType {
  userName: any;
  pId: any;
}
export interface playerObjectType {
  _id: IdType;
  total: number;
  myCount: number;
  parentName: string;
  rank?: string;
}
