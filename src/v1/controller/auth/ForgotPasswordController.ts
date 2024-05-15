import * as express from 'express';
import {
  UserAuthPayload,
  LoginResponse,
  CheckUserSession,
  ForgotpasswordPayload,
  CreateUserPayload,
  ListUsers,
  CreateAffiliatePayload,
  CreateSubAffiliatePayload,
  ListAffiliate,
} from './user.interface';
import {
  fromObject,
  toObject,
  isPayloadValid,
  requiredValidation,
  buildAffliateQueryObject,
} from '../../helpers/utils';
import {
  userPayload,
  forgotPayload,
  loginResponsePayload,
  checkUserSession,
  createUserPayload,
  createUserPayload_requiredFields,
  createAffiliatePayload,
  createSubAffiliatePayload,
} from './user.types';
import { RESPONSE_CODES } from '../../constants';
import {
  validateAffliate,
  validateAffliateEmail,
  createUser as createUserRecord,
  getAffliatesList,
  getAffliatesCount,
  createAffiliateRecord,
  createSubAffiliateRecord,
} from '../../model/queries/auth';
import { generateToken } from '../../helpers/jwt';
import {
  createSessionForLoggedInUser,
  validateUserSession,
} from '../../model/queries/loggedInAffiliates';
import { isEmpty, get } from 'lodash';
import MESSAGES from '../../helpers/messages.error';
import { decrypt } from '../../helpers/crypto';

const catch_response: any = {
  ...RESPONSE_CODES[400],
  message: MESSAGES.API_FAILURE_MESSAGE,
  info: MESSAGES.API_FAILURE_MESSAGE,
};

export const forgotpassword = async (req: express.Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      forgotPayload as ForgotpasswordPayload,
    ) as ForgotpasswordPayload;

    const validatePayload: any = await validateAffliateEmail(requestPayload);

    if (validatePayload && validatePayload?.status === 'Active') {
      const responsePayload: LoginResponse = {
        ...toObject(validatePayload, loginResponsePayload),
        token: generateToken(requestPayload),
      };
      return {
        ...RESPONSE_CODES[401],
        success: false,
        info: 'Success! A link to reset your password has been sent to your registered email.',
      };
    } else {
      return {
        ...RESPONSE_CODES[401],
        success: false,
        info: 'Something went wrong!! unable to get affiliate list',
      };
    }
  } catch (e) {
    return catch_response;
  }
};
