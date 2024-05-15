import {
  UserAuthPayload,
  CheckUserSession,
  CreateUserPayload,
  CreateAffiliatePayload,
  CreateSubAffiliatePayload,
  ForgotpasswordPayload,
  ResetpasswordPayload,
  CheckUser2FA,
  CreateSecret2FA,
  VerifyCode2FA
} from './user.interface';
import { requiredFields } from '../common/common.interface';
import { v4 as uuidv4 } from 'uuid';

export const userPayload: UserAuthPayload = {
  userName: '',
  password: '',
  keyForRakeModules: false,
};

export const forgotPayload: ForgotpasswordPayload = {
  email: '',
};

export const resetpasswordPayload: ResetpasswordPayload = {
  email: '',
  password: '',
};

export const checkUserSession: CheckUserSession = {
  uniqueSessionId: '',
};

export const checkUser2FA: CheckUser2FA = {
  userName: '',
}

export const createSecret2FA: CreateSecret2FA = {
  userName: '',
  secret: '',
}

export const verifyCode2FA: VerifyCode2FA = {
  userName: '',
  code: ''
}

export const loginResponsePayload = {
  department: { key: 'role.name', defaultValue: '' },
  email: { key: 'email', defaultValue: '' },
  isParent: { key: '_id', defaultValue: '' },
  loggedinUserMobileNum: { key: ['mobileNumber', 'mobile'], defaultValue: '' },
  name: { key: 'name', defaultValue: '' },
  // uniqueSessionId: { key: 'uniqueSessionId', defaultValue: uuidv4() },
  role: { key: 'role', defaultValue: '' },
  timestamp: { key: 'timestamp', defaultValue: new Date().getTime() },
  userName: { key: 'userName', defaultValue: '' },
  module: { key: 'module', defaultValue: [] },
};

export const createUserPayload: CreateUserPayload = {
  userName: '',
  password: '',
  createdBy: '',
  module: [],
  name: '',
  reportingTo: '',
  status: '',
  role: { name: '', level: 0 },
  isAuthenticatorEnabled: '',
  countGoogleAuthen: 0,
};

export const createUserPayload_requiredFields: requiredFields = {
  minLength: { 1: ['module', 'userName', 'password'], 4: ['name'] },
  maxLength: { 20: ['userName'] },
};

export const createNoModuleUserPayload_requiredFields: requiredFields = {
  minLength: { 1: ['userName', 'password'], 4: ['name'] },
  maxLength: { 20: ['userName'] },
};

export const listUserMapObject = {
  level: { key: 'role.level', valueAs: { $gt: 0, $lt: 'level' } },
};

export const createAffiliatePayload: CreateAffiliatePayload = {
  name: '',
  userName: '',
  mobile: '',
  email: '',
  password: '',
  role: { name: '', level: 0 },
  dob: '',
  creditLimit: '',
  cityName: '',
  rakeCommision: 0,
  // realChips: 0,
  profit: 0,
  withdrawal: 0,
  status: '',
  address: '',
  createdBy: {
    name: '',
    userName: '',
    role: {
      name: '',
      level: 0,
    },
  },
  createdAt: 0,
  upDateAt: 0,
  withdrawalChips: 0,
  // pulledRealChips: 0,
  // deposit: 0,
  module: [],
  isAuthenticatorEnabled: ''
};

export const createSubAffiliatePayload: CreateSubAffiliatePayload = {
  ...createAffiliatePayload,
  parentUser: '',
};
