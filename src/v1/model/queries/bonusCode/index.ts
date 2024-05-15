import { query } from 'express';
import {
  addPromoBonusPayload,
  BonusCodePayload,
  bonusCodeType,
  codeNameType,
  instantExpireUpdate,
  UpdatePayload,
  IdQueryType,
  ValidPromoQuery,
} from '../../../controller/bonusCode/bonusCodeInterface';
import affiliates from '../../schema/affiliates';
import BonusCollection from '../../schema/bonusCollection';
import PromoBonus from '../../schema/promoBonus';
import logger from '../../../logger';
import { parseStringToObjectId } from '@/shared/helpers/mongoose';

export const findBonus = async (
  query: any,
) => {
  try {
    let newQuery: any = {};
    if (query.profile) {
      newQuery.profile = query.profile;
    }
    if (query.codeName) {
      newQuery.codeName = query.codeName;
    }
    if (query.bonusPercent) {
      newQuery.bonusPercent = query.bonusPercent;
    }
    if (query.bonusCodeType) {
      newQuery['bonusCodeType.type'] = query.bonusCodeType.type;
    }
    if (query.bonusCodeCategoryType) {
      newQuery['bonusCodeCategory.type'] = query.bonusCodeCategoryType;
    }
    if (query.status) {
      newQuery.status = query.status;
    }
    if (query.createdBy) {
      const createdBy = new RegExp(["^", query.createdBy, "$"].join(""), "i");
      newQuery.createdBy = createdBy;
    }
    if (query._id) {
      newQuery._id = parseStringToObjectId(query._id);
    }
    let skip = query.skip || 0;
    let limit = query.limit || 20;
    return await BonusCollection().find(newQuery).skip(skip).limit(limit);
  } catch (e) {
    logger.error(`findBonus , error ${e}`);
    return {};
  }
};

export const saveBonusCode = async (query: BonusCodePayload) => {
  try {
    return await BonusCollection().create(query);
  } catch (e) {
    logger.error(`saveBonusCode , error ${e}`);
    return {};
  }
};

export const udpateBonus = async (
  query: IdQueryType,
  updateData: UpdatePayload | instantExpireUpdate,
) => {
  try {
    return await BonusCollection().findByIdAndUpdate(query, updateData);
  } catch (e) {
    logger.error(`udpateBonus , error ${e}`);
    return {};
  }
};

export const ValidatePromoBonus = async (query: ValidPromoQuery) => {
  try {
    return await affiliates().find(query);
  } catch (e) {
    logger.error(`ValidatePromoBonus , error ${e}`);
    return [];
  }
};

export const savePromoBonus = async (query: addPromoBonusPayload) => {
  try {
    return await PromoBonus().findOneAndUpdate(
      { promoCode: query.promoCode },
      query,
      { new: true, upsert: true },
    );
  } catch (e) {
    logger.error(`savePromoBonus , error ${e}`);
    return {};
  }
};

export const findPromoBonus = async (query: object) => {
  try {
    return await PromoBonus().find();
  } catch (e) {
    logger.error(`findPromoBonus , error ${e}`);
    return {};
  }
};

export const deletePromoBonus = async (query: IdQueryType) => {
  try {
    return await PromoBonus().findByIdAndDelete(query);
  } catch (e) {
    logger.error(`deletePromoBonus , error ${e}`);
    return {};
  }
};

export const bonusDepositCount = async (query: object) => {
  try {
    return await BonusCollection().countDocuments(query);
  } catch (e) {
    logger.error(`bonusDepositCount , error ${e}`);
    return {};
  }
};

export const findBonusHistoryCollection = async (query: object) => {
  try {
    //return await findBonusHistoryCollection.find(query);
    return [];
  } catch (e) {
    logger.error(`findBonusHistoryCollection , error ${e}`);
    return {};
  }
};

export const findActiveBonus = async (query: object) => {
  try {
    return await BonusCollection().find(query);
  } catch (e) {
    logger.error(`findActiveBonus , error ${e}`);
    return {};
  }
};
