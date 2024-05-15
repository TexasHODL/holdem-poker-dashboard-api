import {
  FindQuery,
  LoyaltyPointsPayload,
  updateLoyaltyPointsPayload,
  updateQuery,
} from '../../../controller/loyaltyPoints/loyaltyPointsInterface';
import LoyaltyPoints from '../../schema/loyaltyPoints';
import logger from '../../../logger';

export const findLoyaltyPoints = async (query: FindQuery) => {
  try {
    return await LoyaltyPoints().find(query);
  } catch (e) {
    logger.error(`findLoyaltyPoints , error ${e}`);
    return [];
  }
};

export const saveLoyaltyPoints = async (params: LoyaltyPointsPayload) => {
  const LoyaltyPointModel = LoyaltyPoints();
  try {
    const query = new LoyaltyPointModel(params);
    return await LoyaltyPointModel.create(query);
  } catch (e) {
    logger.error(`saveLoyaltyPoints , error ${e}`);
    return [];
  }
};

export const getLoyaltyPointList = async (query: object) => {
  try {
    return await LoyaltyPoints().find(query);
  } catch (e) {
    logger.error(`getLoyaltyPointList  , error ${e}`);
    return {};
  }
};

export const updateLoyaltyValue = async (id: string, query: updateQuery) => {
  console.log("di vao day");
  
  try {
    return await LoyaltyPoints().findByIdAndUpdate(id, query);
  } catch (e) {
    logger.error(`udpateLoyaltyValue , error ${e}`);
    return {};
  }
};
