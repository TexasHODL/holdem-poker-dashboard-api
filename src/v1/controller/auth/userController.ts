import * as express from 'express';
import {
  UserAuthPayload,
  LoginResponse,
  CheckUserSession,
  CreateUserPayload,
  ListUsers,
  CreateAffiliatePayload,
  CreateSubAffiliatePayload,
  ListAffiliate,
  ForgotpasswordPayload,
  CheckUser2FA,
  CreateSecret2FA,
  VerifyCode2FA
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
  loginResponsePayload,
  checkUserSession,
  createUserPayload,
  createUserPayload_requiredFields,
  createAffiliatePayload,
  createSubAffiliatePayload,
  forgotPayload,
  createNoModuleUserPayload_requiredFields,
  checkUser2FA,
  createSecret2FA,
  verifyCode2FA
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
  getAffiliatesUser,

} from '../../model/queries/auth';
import { generateToken } from '../../helpers/jwt';
import {
  createSessionForLoggedInUser,
  validateUserSession,
  deleteLoggedInUser,
  getSessionForLoggedInUser,
  updateSessionForLoggedInUser,
  checkGoogleAuthenticator,
  createSecretKey,
  updateGoogleCount,
  checkUserOrEmail
} from '../../model/queries/loggedInAffiliates';
import { isEmpty, get } from 'lodash';
import MESSAGES from '../../helpers/messages.error';
import { decrypt } from '../../helpers/crypto'
import { v4 as uuidv4 } from 'uuid';
import speakeasy from "speakeasy";

const catch_response: any = {
  ...RESPONSE_CODES[400],
  message: MESSAGES.API_FAILURE_MESSAGE,
  info: MESSAGES.API_FAILURE_MESSAGE,
};
/**
 *
 * @param req request body
 * @returns validate reponse
 */
export const userAuth = async (req: express.Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      userPayload as UserAuthPayload,
    ) as UserAuthPayload;
    const { isValid, message } = isPayloadValid(requestPayload, userPayload);
    if (isValid) {
      const validatePayload: any = await validateAffliate(requestPayload);
      if (validatePayload && validatePayload?.status === 'Active') {
        const responsePayload: LoginResponse = {
          ...toObject(validatePayload, loginResponsePayload),
          token: generateToken({
            id: validatePayload._id,
            userName: validatePayload.userName,
            keyForRakeModules: requestPayload.keyForRakeModules,
          }),
          isAuthenticatorEnabled: validatePayload.isAuthenticatorEnabled ? validatePayload.isAuthenticatorEnabled : "false",
          uniqueSessionId: uuidv4(),
        };
        const isSessionForLoggedInUser = await getSessionForLoggedInUser(responsePayload)
        if (!isSessionForLoggedInUser) {
          await createSessionForLoggedInUser(responsePayload);
        } else {
          await updateSessionForLoggedInUser(responsePayload);
        }
        return {
          ...RESPONSE_CODES[200],
          result: responsePayload,
        };
      } else if (validatePayload && validatePayload?.status === 'Block') {
        return {
          ...RESPONSE_CODES[200],
          success: false,
          info: 'User blocked!',
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
        ...RESPONSE_CODES[400],
        message,
        success: false,
        info: message,
      };
    }
  } catch (e) {
    throw e;
    return catch_response;
  }
};

export const googleAuthenSecretKey = async (req: express.Request) => {
  const requestPayload: any = fromObject(
    req,
    checkUser2FA as CheckUser2FA,
  ) as CheckUser2FA;
  const { isValid, message } = isPayloadValid(requestPayload, checkUser2FA);
  if (isValid) {
    const isSessionValid = await checkGoogleAuthenticator(requestPayload);
    if (!isEmpty(isSessionValid)) {
      return isSessionValid;
    } else {
      return {
        ...RESPONSE_CODES[400],
      };
    }
  } else {
    return {
      ...RESPONSE_CODES[400],
      message,
      info: message,
    };
  }
};

export const getSecretKeyGoogleAuthen = async (req: express.Request) => {
  const requestPayload: any = fromObject(
    req,
    checkUser2FA as CheckUser2FA,
  ) as CheckUser2FA;
  const { isValid, message } = isPayloadValid(requestPayload, checkUser2FA);
  if (isValid) {
    var secret = speakeasy.generateSecret();
    const data = { userName: requestPayload.userName, secret: secret.base32 }
    const isSessionValid = await createSecretKey(data);
    if (!isEmpty(isSessionValid)) {
      const secretKey = await checkGoogleAuthenticator(requestPayload);
      return secretKey;
    } else {
      return {
        ...RESPONSE_CODES[400],
      };
    }
  } else {
    return {
      ...RESPONSE_CODES[400],
      message,
      info: message,
    };
  }
};

export const verifyGoogleAuthenCode = async (req: express.Request) => {
  const requestPayload: any = fromObject(
    req,
    verifyCode2FA as VerifyCode2FA,
  ) as VerifyCode2FA;
  const { isValid, message } = isPayloadValid(requestPayload, verifyCode2FA); 
  if (isValid) {
    const user = await checkGoogleAuthenticator(requestPayload);
    if (user) {
      const secret = user.secret;
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: requestPayload.code
      });
      if (verified) {
        const updateCount = await updateGoogleCount(requestPayload);
        return {
          ...RESPONSE_CODES[200],
          // result: responsePayload,
        };
      } else {
        return {
          ...RESPONSE_CODES[400],
          message,
          info: "Google Authenticator code incorrect",
        };
      }
    }
  }else {
    return {
      ...RESPONSE_CODES[400],
      message,
      info: message,
    };
  }
};


export const checkUserSessionInDb = async (req: express.Request) => {
  const requestPayload: any = fromObject(
    req,
    checkUserSession as CheckUserSession,
  ) as CheckUserSession;
  const { isValid, message } = isPayloadValid(requestPayload, checkUserSession);
  if (isValid) {
    const isSessionValid = await validateUserSession(requestPayload);
    if (!isEmpty(isSessionValid)) {
      return isSessionValid;
    } else {
      return {
        ...RESPONSE_CODES[400],
      };
    }
  } else {
    return {
      ...RESPONSE_CODES[400],
      message,
      info: message,
    };
  }
};

export const removeLoggedInAffiliates = async (req: express.Request) => {
  const requestPayload: any = fromObject(
    req,
    checkUserSession as CheckUserSession,
  ) as CheckUserSession;
  console.log("checkUserSessionInDb: ", requestPayload);
  const { isValid, message } = isPayloadValid(requestPayload, checkUserSession);
  if (isValid) {
    const isRemoveSessionValid = await deleteLoggedInUser(requestPayload);
    console.log("isRemoveSessionValid: ", isRemoveSessionValid);
    // if (!isEmpty(isRemoveSessionValid)) {
    //   return isRemoveSessionValid;
    // } else {
    //   return {
    //     ...RESPONSE_CODES[400],
    //   };
    // }
  } else {
    return {
      ...RESPONSE_CODES[400],
      message,
      info: message,
    };
  }
};

export const createUser = async (req: express.Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      createUserPayload as CreateUserPayload,
    ) as CreateUserPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      createUserPayload,
    );
    if (isValid) {
      // const isRequiredFilled = requiredValidation(
      //   requestPayload,
      //   createUserPayload_requiredFields,
      // );
      // if (isRequiredFilled.length) {
      //   return {
      //     ...RESPONSE_CODES[400],
      //     message: isRequiredFilled,
      //     info: isRequiredFilled,
      //   };
      // }
      const createUserEntry = await createUserRecord(requestPayload);
      return {
        ...RESPONSE_CODES[200],
        isValid,
        message,
        ...createUserEntry,
      };
    } else {
      return {
        ...RESPONSE_CODES[400],
        message,
        info: message,
      };
    }
  } catch (e) {
    return catch_response;
  }
};

export const listUser = async (req: express.Request) => {
  try {
    const queryObject = buildAffliateQueryObject(
      req.body as ListUsers,
      'users',
    );
    const usersListData = await getAffliatesList({ queryObject });

    return {
      ...RESPONSE_CODES[200],
      result: usersListData.map((eachUser) => {
        return {
          ...get(eachUser, '_doc'),
          profit: parseFloat(get(eachUser, 'profit', 0).toFixed(2)),
          password: decrypt(eachUser.password).result,
        };
      }),
    };
  } catch (e) {
    return catch_response;
  }
};

export const countUsers = async (req: express.Request) => {
  try {
    const queryObject = buildAffliateQueryObject(
      req.body as ListUsers,
      'users',
    );
    const usersListData = await getAffliatesCount({ queryObject });
    return {
      ...RESPONSE_CODES[200],
      result: usersListData,
    };
  } catch (e) {
    return catch_response;
  }
};

export const createNewAffiliate = async (req: express.Request) => {
  const requestPayload: any = fromObject(
    req,
    createAffiliatePayload as CreateAffiliatePayload,
  ) as CreateAffiliatePayload;
  console.log("requestPayload: ", requestPayload);

  const { isValid, message } = isPayloadValid(
    requestPayload,
    createAffiliatePayload,
  );

  try {
    if (isValid) {
      const isRequiredFilled = requiredValidation(
        requestPayload,
        createNoModuleUserPayload_requiredFields,
      );

      // if (isRequiredFilled.length) {
      //   return {
      //     ...RESPONSE_CODES[400],
      //     message: isRequiredFilled,
      //     info: isRequiredFilled,
      //   };
      // }

      const createUserEntry: any = await createAffiliateRecord(requestPayload);

      return {
        ...RESPONSE_CODES[200],
        isValid,
        message,
        ...createUserEntry,
      };
    }

    return {
      ...RESPONSE_CODES[400],
      message,
      info: message,
    };
  } catch (e) {
    return catch_response;
  }
};

export const createSubAffiliate = async (req: express.Request) => {
  const requestPayload: any = fromObject(
    req,
    createSubAffiliatePayload as CreateSubAffiliatePayload,
  ) as CreateSubAffiliatePayload;
  const { isValid, message } = isPayloadValid(
    requestPayload,
    createSubAffiliatePayload,
  );

  try {
    if (isValid) {
      const isRequiredFilled = requiredValidation(
        requestPayload,
        createNoModuleUserPayload_requiredFields,
      );

      // if (isRequiredFilled.length) {
      //   return {
      //     ...RESPONSE_CODES[400],
      //     message: isRequiredFilled,
      //     info: isRequiredFilled,
      //   };
      // }

      const createUserEntry: any = await createSubAffiliateRecord(
        requestPayload,
      );

      return {
        ...RESPONSE_CODES[200],
        isValid,
        message,
        ...createUserEntry,
      };
    }

    return {
      ...RESPONSE_CODES[400],
      message,
      info: message,
    };
  } catch (e) {
    return catch_response;
  }
};

export const getAffliatesByType = async (
  req: express.Request,
  requestFor: string,
  reuqestType: 'findAll' | 'count',
) => {
  const queryObject = buildAffliateQueryObject(
    req.body as ListAffiliate,
    requestFor,
  );
  console.log("queryObject111 ", queryObject);
  const affiliateListData = await getAffliatesList({ queryObject });
  console.log("affiliateListData: ", affiliateListData);
  try {
    return {
      ...RESPONSE_CODES[200],
      result:
        reuqestType === 'count'
          ? affiliateListData.length
          : affiliateListData.map((eachAffliate) => {
              return {
                ...get(eachAffliate, '_doc'),
                profit: parseFloat(get(eachAffliate, 'profit', 0).toFixed(2)),
                password: get(
                  decrypt(get(eachAffliate, 'password')),
                  'result',
                  '',
                ),
              };
            }),
    };
  } catch (e) {
    return catch_response;
  }
};

export const getAffiliateByUserName = async (
  req: express.Request,
) => {
  const affiliateListData = await getAffiliatesUser({ userName: req.body.userName });
  try {
    return {
      ...RESPONSE_CODES[200],
      result:
          affiliateListData.length
          && affiliateListData.map((eachAffliate) => {
              return {
                ...get(eachAffliate, '_doc'),
                profit: parseFloat(get(eachAffliate, 'profit', 0).toFixed(2)),
                password: get(
                  decrypt(get(eachAffliate, 'password')),
                  'result',
                  '',
                ),
              };
            }),
    };
  } catch (e) {
    return catch_response;
  }
};

export const listAffiliate = async (req: express.Request) => {
  return getAffliatesByType(req, 'affiliate', 'findAll');
};

export const listOneAffiliate = async (req: express.Request) => {
  return getAffliatesByType(req, 'affiliate', 'findAll');
};

export const listSubAffiliate = async (req: express.Request) => {
  return getAffliatesByType(req, 'subAffiliate', 'findAll');
};

export const affiliateCount = async (req: express.Request) => {
  return getAffliatesByType(req, 'affiliate', 'count');
};

export const subAffiliateCount = async (req: express.Request) => {
  return getAffliatesByType(req, 'subAffiliate', 'count');
};

export const listAffiliateWithUserName = async (req: express.Request) => {
  return getAffiliateByUserName(req);
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

export const checkEmailORUserName = async (params) => {
  console.log("inside checkEmailORUserName", params);
  
  const resData = await checkUserOrEmail(params);
  console.log("resData: ", resData);
  if (resData.length > 0) {
    const verified = speakeasy.totp.verify({
      secret: resData[0].secret,
      encoding: 'base32',
      token: params.code
    });
    if (verified) {
      return {
        ...RESPONSE_CODES[200],
        user: resData[0]
        // result: responsePayload,
      };
    } else {
      return {
        ...RESPONSE_CODES[400],
        info: "authCode incorrect",
      };
    }
  } else {
    return {
      ...RESPONSE_CODES[400],
      info: "email or userName incorrect",
    };
  }
} 
