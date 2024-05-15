export interface UserAuthPayload {
  userName: '' | string;
  password: '' | string;
  keyForRakeModules: false | boolean;
}

export interface ForgotpasswordPayload {
  email: '' | string;
}

export interface ResetpasswordPayload {
  email: '' | string;
  password: '' | string;
}

export interface LoginResponse {
  department: string;
  email: string;
  isParent: string;
  loggedinUserMobileNum: string;
  name: string;
  uniqueSessionId: string;
  role: Role;
  timestamp: number;
  userName: string;
  token: string;
  isAuthenticatorEnabled: string
}

export interface Role {
  name: string;
  level: number;
}
export interface CheckUserSession {
  uniqueSessionId: string;
}
export interface CheckUser2FA {
  userName: string;
}

export interface CreateSecret2FA {
  userName: string;
  secret: string;
}

export interface VerifyCode2FA {
  userName: string;
  code: string;
}

export interface Article {
  slug?: string;
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
}

export interface CreateUserPayload {
  createdBy: string;
  module: string[];
  name: string;
  password: string;
  reportingTo: string;
  status: string;
  userName: string;
  role: Role;
  createdAt?: Date | number;
  isAuthenticatorEnabled?: string;
  countGoogleAuthen?: number;
}

export interface ListUsers {
  level?: number;
  _id?: string;
  department?: number | string;
  status?: string;
  email?: string;
  name?: string;
  skip?: number;
  limit?: number;
}

export interface CreateAffiliatePayload {
  name: string;
  userName: string;
  mobile: any;
  email: string;
  password: string;
  role: Role;
  dob: any;
  creditLimit?: string;
  cityName: string;
  rakeCommision: number;
  realChips?: number;
  profit: number;
  withdrawal: number;
  status: string;
  address: string;
  createdBy: CreatedBy;
  createdAt: number;
  upDateAt: number;
  withdrawalChips: number;
  pulledRealChips?: number;
  deposit?: number;
  module: string[];
  isAuthenticatorEnabled?: string;
}
export interface CreatedBy {
  name: string;
  userName: string;
  role: Role;
}

export interface CreateSubAffiliatePayload extends CreateAffiliatePayload {
  parentUser: string;
  parentName?: string;
}

export interface ListAffiliate extends ListUsers {
  userName?: string;
  loginId?: string;
  parentUser?: string;
}
