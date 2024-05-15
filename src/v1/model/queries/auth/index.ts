import affiliates from '../../schema/affiliates';
import {
  UserAuthPayload,
  CreateUserPayload,
  ForgotpasswordPayload,
  CreateAffiliatePayload,
  CreateSubAffiliatePayload,
} from '../../../controller/auth/user.interface';
import { reponseObject } from '../../../controller/common/common.interface';
import { encrypt } from '../../../helpers/crypto';
import {
  isValidateEmail,
  generatePassword,
  evaluates,
} from '../../../helpers/utils';
import {
  isEmpty,
  get,
  intersection,
  isEqual,
  pick,
  difference,
  indexOf,
  unset,
} from 'lodash';

export const validateAffliate = async (requestPayload: UserAuthPayload) => {
  const { userName, password } = requestPayload;
  const { success, result } = encrypt(password);
  // const res = await affiliates().find({userName: userName});
  const res = await affiliates().findOne({
    userName,
    password: success ? result : '',
  });
  console.log('res', res);

  try {
    return isValidateEmail(userName)
      ? (await affiliates().findOne({
        email: userName,
        password: success ? result : '',
      })) || {}
      : (await affiliates().findOne({
        userName,
        password: success ? result : '',
      })) || {};
  } catch (e) {
    return {};
  }
};
export const validateAffliateEmail = async (
  forgotRequestPayload: ForgotpasswordPayload,
) => {
  const { email } = forgotRequestPayload;
  try {
    return isValidateEmail(email)
      ? (await affiliates().findOne({ email: email })) || {}
      : {};
  } catch (e) {
    return {};
  }
};

export const createUser = async (requestPayload: CreateUserPayload) => {
  console.log("requestPayloadcreateUser ", requestPayload);
  const { userName, password, reportingTo, module, role } = requestPayload;
  const { success, result } = encrypt(password);
  const responseObject: reponseObject = { success: false };

  try {
    if (success) {
      requestPayload.password = result as string;

      const isUserExists =
        (await affiliates().findOne({ userName: evaluates(userName) })) || {};

      if (!isEmpty(isUserExists)) {
        responseObject.message = 'UserAlready exists';
      } else {
        const reportingUser =
          (await affiliates().findOne({ userName: evaluates(reportingTo) })) ||
          {};

        if (isEmpty(reportingUser)) {
          responseObject.message = 'Reporting manager does not exist.';
        } else {
          // requestPayload.reportingTo = get(responseObject, 'userName', '');
          requestPayload.reportingTo = get(responseObject, 'userName', reportingTo);

          if (
            isEqual(
              intersection(module, get(reportingUser, 'module', [])),
              module,
            ) ||
            get(reportingUser, 'role.level') > 6
          ) {
            if (role.level < get(reportingUser, 'role.level')) {
              requestPayload.createdAt = Number(new Date());
              requestPayload.countGoogleAuthen = 0;
              const createUser = await affiliates().insertMany([
                requestPayload,
              ]);

              if (isEmpty(createUser)) {
                responseObject.message = 'unable to create User';
              } else {
                responseObject.message = `Successfully create User ${userName}`;
                responseObject.success = true;
              }
            } else {
              responseObject.message =
                'This user cannot be created under the specified reporting manager.';
            }
          } else {
            responseObject.message = 'Unable to get reporting manager data.';
          }
        }
      }
    } else {
      responseObject.message = 'Unable to decode password';
    }

    return responseObject;
  } catch (e) {
    return {};
  }
};

export const getAffliatesList = async (query: object) => {
  try {
    const skip = get(query, 'queryObject.skip', 0);
    const limit = get(query, 'queryObject.limit', 0);

    unset(query, 'queryObject.skip');
    unset(query, 'queryObject.limit');
    unset(query, 'queryObject.roleName');

    return await affiliates()
      .find(get(query, 'queryObject', {}))
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  } catch (e) {
    return [];
  }
};

export const getAffiliatesUser = async (query: object) => {
  try {
    return await affiliates().find(query)
  } catch (error) {
    return [];
  }
}

export const getAffliatesCount = async (query: object) => {
  try {
    return await affiliates().count(get(query, 'queryObject', {}));
  } catch (e) {
    return [];
  }
};

export const createAffiliateRecord = async (
  requestPayload: CreateAffiliatePayload,
) => {
  const { userName, password, module, role } = requestPayload;
  const responseObject: reponseObject = { success: false };
  requestPayload.password = password
    ? (get(encrypt(password), 'result') as string)
    : (get(encrypt(generatePassword({ symbols: false })), 'result') as string);
  const isUserExists =
    (await affiliates().findOne({ userName: evaluates(userName) })) || {};

  if (!isEmpty(isUserExists)) {
    responseObject.message = 'UserAlready exists';
  } else {
    const affliateRequestPayload = {
      ...requestPayload,
      chipsManagement: {
        deposit: 0,
        withdrawl: 0,
        withdrawlCount: 0,
        profitCount: 0,
        profitWithdrawlDate: Number(new Date()),
        withdrawlPercent: 5,
        withdrawlDate: Number(new Date()),
      },
    };

    const createAffliate = await affiliates().insertMany([
      affliateRequestPayload,
    ]);

    if (isEmpty(createAffliate)) {
      responseObject.message = 'unable to create affiliate';
    } else {
      responseObject.message = `Successfully create affiliate ${userName}`;
      responseObject.success = true;
    }
  }

  return responseObject;
};

export const createSubAffiliateRecord = async (
  requestPayload: CreateSubAffiliatePayload,
) => {
  const { userName, password, module, role, parentUser, rakeCommision } = requestPayload;
  const responseObject: reponseObject = { success: false };

  requestPayload.password = password ?
    (get(encrypt(password), 'result') as string) :
    (get(encrypt(generatePassword({ symbols: false })), 'result') as string);

  const isUserExists = (await affiliates().findOne({ userName: evaluates(userName) })) || {};

  if (!isEmpty(isUserExists)) {
    responseObject.message = 'UserAlready exists';
  } else {
    const isParentUserExists = (await affiliates().findOne({ userName: evaluates(parentUser) })) || {};

    if (
      get(isParentUserExists, 'role.level') === 0 &&
      get(isParentUserExists, 'status')
    ) {
      if (get(isParentUserExists, 'rakeCommision') <= rakeCommision) {
        responseObject.message = 'Rake Commission percent of Sub-Affiliate is greater/equal to Affiliate';
      } else {
        if (get(role, 'name') === 'newsubAffiliate') {
          if (get(isParentUserExists, 'role.name') === 'affiliate') {
            responseObject.message = 'Parent must be Affiliate';
          }
        } else {
          if (get(isParentUserExists, 'role.name') === 'newaffiliate') {
            responseObject.message = 'Parent must be Agent.';
          }
        }

        if (responseObject.message && responseObject.message !== '') {
          return responseObject;
        }

        requestPayload.parentName = get(isParentUserExists, 'name');
        requestPayload.parentUser = get(isParentUserExists, 'userName');

        if (
          (isEqual(
            intersection(module, get(isParentUserExists, 'module', [])),
            module,
          ),
            module) ||
          indexOf(
            difference(module, get(isParentUserExists, 'module', [])),
            '2005',
          ) > -1
        ) {
          const affliateRequestPayload = {
            ...requestPayload,
            chipsManagement: {
              deposit: 0,
              withdrawl: 0,
              withdrawlCount: 0,
              profitCount: 0,
              profitWithdrawlDate: Number(new Date()),
              withdrawlPercent: 5, //no sub-aff
              withdrawlDate: Number(new Date()),
            },
          };

          const createAffliate = await affiliates().insertMany([
            affliateRequestPayload,
          ]);

          if (isEmpty(createAffliate)) {
            responseObject.message = 'unable to create affiliate';
          } else {
            responseObject.message = `Successfully create affiliate ${userName}`;
            responseObject.success = true;
          }
        } else {
          responseObject.message = 'Sub-affiliate cannot have more access than parent affiliate.';
        }
      }
    } else if (isEmpty(isParentUserExists)) {
      responseObject.message = 'Parent affiliate does not exists.';
    } else {
      responseObject.message = 'Unable to process your request';
    }
  }

  return responseObject;
};