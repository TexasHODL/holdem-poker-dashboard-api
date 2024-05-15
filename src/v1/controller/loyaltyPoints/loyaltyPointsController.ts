import * as express from 'express';
import { RESPONSE_CODES } from '../../constants';
import { fromObject, isPayloadValid } from '../../helpers/utils';
import {
  LoyaltyPointsPayload,
  updateLoyaltyPointsPayload,
  updateQuery,
} from './loyaltyPointsInterface';
import { loyaltyPayload, updateLoyaltyPayload } from './loyaltyPointsType';
import {
  findLoyaltyPoints,
  getLoyaltyPointList,
  updateLoyaltyValue,
} from '../../model/queries/loyalty';
import { saveLoyaltyPoints } from '../../model/queries/loyalty';
import MESSAGES from '../../helpers/messages.error';
import { isEmpty, isArray } from 'lodash';
import logger from '../../logger';
import mongoose, { ObjectId } from 'mongoose';

const catch_response: any = {
  ...RESPONSE_CODES[500],
  success: false,
  info: MESSAGES.API_FAILURE_MESSAGE,
};

const success_response: any = {
  ...RESPONSE_CODES[200],
  success: true,
};

const error_response: any = {
  ...RESPONSE_CODES[400],
  success: false,
};

/**
 * @method checkAlreadyExists
 * This method checks  loyalty level already exists.
 */
const checkAlreadyExists = async (params: LoyaltyPointsPayload) => {
  const query = { loyaltyLevel: params.loyaltyLevel };
  const getValue = await findLoyaltyPoints(query);
  return getValue.length > 0
    ? {
        ...RESPONSE_CODES[400],
        success: false,
        info: 'Specified loyalty points already exists',
      }
    : {
        ...RESPONSE_CODES[200],
        success: true,
        result: params,
      };
};

/**
 * @method checkAlreadyExists
 * This method checks below level exists.
 */
const checkBelowLevelExists = async (params: LoyaltyPointsPayload) => {
  if (params.loyaltyLevel === 'Bronze') {
    return {
      ...RESPONSE_CODES[200],
      success: true,
      result: params,
    };
  } else {
    const loyaltyLevelArray = [
      'Bronze',
      'Chrome',
      'Silver',
      'Gold',
      'Diamond',
      'Platinum',
    ];
    const checkElementIndex =
      loyaltyLevelArray.indexOf(params.loyaltyLevel) - 1;
    params.levelId = checkElementIndex;
    const checkElement = loyaltyLevelArray[checkElementIndex];
    const query = { loyaltyLevel: checkElement };
    const getValue = await findLoyaltyPoints(query);
    return getValue.length > 0
      ? {
          ...RESPONSE_CODES[200],
          success: true,
          result: params,
        }
      : {
          ...RESPONSE_CODES[400],
          success: false,
          info: `Create loyalty points for ${checkElement} level !`,
        };
  }
};

/**
 * @method checkAlreadyExists
 * This method assigns levelId field in params.
 */
const mapLevelId = (str: string) => {
  const levelIds: { [id: string]: number } = {
    Bronze: 1,
    Chrome: 2,
    Silver: 3,
    Gold: 4,
    Diamond: 5,
    Platinum: 6,
  };
  return levelIds[str];
};

/**
 * @method checkAlreadyExists
 * This method to create new loyalty level.
 */
const createNewLoyaltyLevel = async (params: LoyaltyPointsPayload) => {
  params.levelId = await mapLevelId(params.loyaltyLevel);
  const query = params;
  const result = await saveLoyaltyPoints(query);
  return {
    ...RESPONSE_CODES[200],
    success: true,
    info: 'loyalty points created successfully',
    result: result,
  };
};

/**
 * @method createLoyaltyPoints
 * This method is used to Create the loyality points.
 */
export const createLoyaltyPoints = async (req: express.Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      loyaltyPayload as LoyaltyPointsPayload,
    );
    const { isValid, message } = isPayloadValid(requestPayload, loyaltyPayload);
    if (isValid) {
      const params = req.body;
      console.log("paramscreateLoyaltyPoints ", params);
      const checkLoyaltyExists = await checkAlreadyExists(params);
      console.log('checkLoyaltyExists',checkLoyaltyExists)
      if (checkLoyaltyExists.success) {
        const checkBelowLevel = await checkBelowLevelExists(params);
        if (checkBelowLevel.success === true) {
          return await createNewLoyaltyLevel(params);
        } else {
          return checkBelowLevel;
        }
      } else {
        return checkLoyaltyExists;
      }
    } else {
      return {
        ...RESPONSE_CODES[400],
        message,
        success: false,
        info: message,
      };
    }
  } catch (err) {
    logger.error(`createLoyaltyPoints , error ${err}`);
    return catch_response;
  }
};

/**
 * @method listLoyaltyPoints
 * This method is used to list out all the loyalty points exists.
 */
export const listLoyaltyPoints = async (req: express.Request) => {
  try {
    let query: any = {};
    if (req.body._id) {
      query._id = new mongoose.Types.ObjectId(req.body._id);
    }
    const getValue = await getLoyaltyPointList(query);
    if (isArray(getValue) && !isEmpty(getValue)) {
      return {
        ...success_response,
        info: 'records found',
        result: getValue,
      };
    } else if (isArray(getValue) && isEmpty(getValue)) {
      return {
        ...success_response,
        info: 'no records found',
        result: getValue,
      };
    } else {
      return {
        ...error_response,
        info: 'error in getting loyalty points list',
      };
    }
  } catch (err) {
    logger.error(`listLoyaltyPoints , error ${err}`);
    return catch_response;
  }
};

/**
 * @method updateLoyaltyLevel
 * This method is used to update the loyalty level , it called from updateLoyaltyPoints method.
 */
const updateLoyaltyLevel = async (params: updateLoyaltyPointsPayload) => {
  params.levelId = mapLevelId(params.loyaltyLevel);
  const query: updateQuery = {
    loyaltyLevel: params.loyaltyLevel,
    levelThreshold: params.levelThreshold,
    percentReward: params.percentReward,
    levelId: params.levelId,
  };
  const result = await updateLoyaltyValue(params._id, query);
  return Object.keys(result).length > 0
    ? {
        ...success_response,
        info: 'loyalty points updated successfully',
      }
    : {
        ...error_response,
        info: 'error in updating loyalty points',
      };
};

/**
 * @method updateLoyaltyPoints
 * This method is used to update the loyalty points.
 */
export const updateLoyaltyPoints = async (req: express.Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      updateLoyaltyPayload as updateLoyaltyPointsPayload,
    );
    const { isValid, message } = isPayloadValid(
      requestPayload,
      updateLoyaltyPayload,
    );

    if (isValid) {
      const params = req.body;
      return await updateLoyaltyLevel(params);
    } else {
      return {
        ...RESPONSE_CODES[400],
        message,
        info: 'invalid request payload',
      };
    }
  } catch (err) {
    logger.error(`udpateLoyaltyPoints , error ${err}`);
    return catch_response;
  }
};
