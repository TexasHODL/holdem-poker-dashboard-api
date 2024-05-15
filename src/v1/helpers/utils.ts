import * as express from 'express';
import {
  pick,
  isEqual,
  differenceWith,
  get,
  updateWith,
  constant,
} from 'lodash';
import { requiredFields } from '../controller/common/common.interface';
import {
  ListUsers,
  ListAffiliate,
  ForgotpasswordPayload,
} from '../controller/auth/user.interface';
import generator from 'generate-password';
/**
 *
 * @param req express.Request
 * @returns boolean
 */
export const fromObject = (req: express.Request, referenceObj: Object) => {
  try {
    return pick(req.body, Object.keys(referenceObj));
  } catch (e) {
    return {};
  }
};

/**
 *
 * @param response object
 * @param referenceObj object
 * @returns object
 */
export const toObject = (response: object, referenceObj: Object) => {
  try {
    const reponseKeys = Object.keys(get(response, '_doc', {}));
    const responseData: object[] = Object.keys(referenceObj).map((eachKey) => {
      const mappedKey = get(referenceObj, `${eachKey}.key`);
      
      // if response object expects or check on key, then checking with array of possible keys on object
      const refKey =
      typeof mappedKey === 'object'
      ? mappedKey.find((eacrespKey: string) => {
        return reponseKeys.includes(eacrespKey);
      })
      : mappedKey;
      return {
        [eachKey]: get(
          response,
          refKey,
          get(referenceObj, `${eachKey}.defaultValue`),
          ),
        };
      });
    return Object.assign({}, ...responseData);
  } catch (e) {
    return {};
  }
};
/**
 *
 * @param refObject object
 * @param baseObject oject
 * @returns boolean
 */

export const fromParams = (refObject: object, referenceObj: Object) => {
  try {
    return pick(refObject, Object.keys(referenceObj));
  } catch (e) {
    return {};
  }
};

export const isPayloadValid = (refObject: object, baseObject: object) => {
  const baseKeys: string[] = Object.keys(baseObject).flat();
  const refKeys: string[] = Object.keys(refObject).flat();
  const isValid = isEqual(baseKeys, refKeys);
  return {
    isValid: isValid,
    message: isValid
      ? ''
      : `${differenceWith(baseKeys, refKeys).join(
        ',',
      )} are(is) missed from payload`,
  };
};

export const requiredValidation = (
  refObject: object,
  baseObject: requiredFields,
  ) => {
  let message = '';
  if (baseObject.minLength) {
    const missedFields = fieldValidations(refObject, baseObject, 'minLength');
    message += missedFields.length
      ? `${missedFields.join(',')} are(is) missed with min validation, `
      : '';
  }
  if (baseObject.maxLength) {
    const missedFields = fieldValidations(refObject, baseObject, 'maxLength');
    message += missedFields.length
      ? `${missedFields.join(',')} are(is) missed with max validation`
      : '';
  }
  return message;
};

export const fieldValidations = (
  refObject: object,
  baseObject: requiredFields,
  type: 'minLength' | 'maxLength',
) => {
  try {
    const missedFields: string[] = [];
    Object.keys(get(baseObject, type, {})).map((eachLimit: string) => {
      get(baseObject[type], eachLimit).map((eachField: string) => {
        const fieldLength = get(refObject, eachField).length;
        if (type === 'minLength' && fieldLength < eachLimit) {
          missedFields.push(eachField);
        }
        if (type === 'maxLength' && fieldLength > eachLimit) {
          missedFields.push(eachField);
        }
      });
    });
    return [...new Set(missedFields)];
  } catch (e) {
    return [];
  }
};
/**
 *
 * @param email srting
 * @returns boolean
 */
export const isValidateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const evaluates = (str: string) => eval(`/${str}/i`);

export const getFlatObject: any = (refObject: object, prefix = '') => {
  try {
    return Object.entries(refObject).flatMap(
      ([k, v]) => {
        return [[`${prefix}${k}`, v]];
      },
      // Object(v) === v
      //   ? getFlatObject(v, `${prefix}${k}.`)
      //   : [[`${prefix}${k}`, v]],
    );
  } catch (e) {
    return {};
  }
};

export const compactObject = (refObject: object) => {
  try {
    return Object.assign(
      {},
      ...Object.entries(refObject).map((keyValues) => {
        return keyValues[1] !== ''
          ? {
            [keyValues[0] as unknown as string]: keyValues[1],
          }
          : {};
      }),
    );
  } catch (e) {
    return {};
  }
};

export const getNestedObject = (flatObject: object) => {
  const nestedObject = {};
  try {
    Object.entries(flatObject).map((keyValues: any[]) => {
      return updateWith(
        nestedObject,
        keyValues[0],
        constant(keyValues[1]),
        Object,
      );
    });
    return nestedObject;
  } catch (e) {
    return nestedObject;
  }
};

export const buildQueryObject = (queryObject: object) => {
  try {
    return compactObject(Object.fromEntries(getFlatObject(queryObject)));
  } catch (e) {
    return {};
  }
};

export const buildAffliateQueryObject = (
  requestObject: ListUsers | ListAffiliate,
  requestFor: string,
) => {
  const queryObjectFields = {
    _id: get(requestObject, '_id', ''),
    status: get(requestObject, 'status', ''),
    email: get(requestObject, 'email', '') ? evaluates(get(requestObject, 'email') as string) : '',
    name: get(requestObject, 'name', '') ? evaluates(get(requestObject, 'name') as string) : '',
    skip: get(requestObject, 'skip', ''),
    limit: get(requestObject, 'limit', ''),
    loginId: get(requestObject, 'loginId', ''),
    mobile: get(requestObject, 'mobile', ''),
    roleName: get(requestObject, 'roleName', ''),
    parentUser: get(requestObject, 'parentUser', ''),
    userName: get(requestObject, 'userName', ''),
  };

  const buildQueryObjectSet = buildQueryObject(queryObjectFields);

  let queryObject: object = {};

  if (requestFor === 'users') {
    if (requestObject.level) {
      queryObject = {
        ...buildQueryObjectSet,
        'role.level': { $gt: 0, $lt: requestObject.level },
      };
    }

    if (requestObject.department) {
      queryObject = {
        ...buildQueryObjectSet,
        'role.level': requestObject.department,
      };
    }
  } else {
    const roleLevel = requestFor === 'affiliate' ? 0 : -1;
    queryObject = {
      ...buildQueryObjectSet,
      'role.level': roleLevel,
      'role.name': get(requestObject, 'roleName'),
    };
  }

  return queryObject;
};

export const generatePassword = ({
  length = 8,
  numbers = true,
  uppercase = true,
  symbols = true,
}: {
  length?: number;
  numbers?: boolean;
  uppercase?: boolean;
  symbols?: boolean;
} = {}) => {
  return generator.generate({
    length,
    numbers,
    uppercase,
    symbols,
  });
};

export const createUniqueId = (len: number) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < (len || 15); i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const checkPassword = (password: string, newPassword: string) => {
  let validate = false;
  if (password == newPassword) {
    validate = true;
  }
  return validate;
};

export const fixedDecimal = (number: number, precisionValue: number) => {
  const precision = precisionValue ? precisionValue : 2;
  return Number(Number(number).toFixed(precision));
};
