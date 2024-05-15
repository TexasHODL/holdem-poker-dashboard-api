import * as express from 'express';
import {
  UserAuthPayload,
  LoginResponse,
  CheckUserSession,
  ForgotpasswordPayload,
  ResetpasswordPayload,
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
  checkPassword,
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
  resetpasswordPayload,
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
  UpdatePasswordForLoggedInUser,
} from '../../model/queries/loggedInAffiliates';
import { isEmpty, get } from 'lodash';
import MESSAGES from '../../helpers/messages.error';
import { decrypt } from '../../helpers/crypto';

const catch_response: any = {
  ...RESPONSE_CODES[400],
  message: MESSAGES.API_FAILURE_MESSAGE,
  info: MESSAGES.API_FAILURE_MESSAGE,
};

export const resetPassword = async (req: express.Request) => {
  try {
    console.log('resetPassword', JSON.stringify(req.body));

    const requestPayload: any = fromObject(
      req,
      resetpasswordPayload as ResetpasswordPayload,
    ) as ResetpasswordPayload;

    const validatePayload: any = await checkPassword(
      requestPayload.email,
      requestPayload.password,
    );

    if (validatePayload) {
      const responsePayload = UpdatePasswordForLoggedInUser(requestPayload);
      if (responsePayload) {
        return {
          ...RESPONSE_CODES[401],
          success: false,
          info: 'Success! Passwored got changed.',
        };
      } else {
        return {
          ...RESPONSE_CODES[401],
          success: false,
          info: 'Something went wrong!! unable to get affiliate list',
        };
      }
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
