import {
  findTotalChipsAddedQuery,
  findUserOptsQuery,
  queryType,
} from '../../../controller/activity/activityInterface';
import Fundrake from '../../schema/fundrake';
import UserSession from '../../schema/userSession';
import PlayerLoginData from '../../schema/playerLoginData';
import TransactionHistory from '../../schema/transactionHistory';
import { groupBy } from 'lodash';
import Users from '../../schema/users';
import logger from '../../../logger';

export const findTotalRakeGenerated = async (
  query: queryType,
  groupBy: string,
  aggregateBy: string,
) => {
  try {
    return await Fundrake().aggregate([
      { $match: query },
      { $group: { _id: groupBy, amount: { $sum: aggregateBy } } },
    ]);
  } catch (e) {
    logger.error(`findTotalRakeGenerated , error ${e}`);
    throw e;
    return 'Error in getting data';
    //return {}
  }
};

export const findUserSessionCountInDB = async (query: object) => {
  try {
    return await UserSession().estimatedDocumentCount(query);
  } catch (e) {
    logger.error(`findUserSessionCountInDB , error ${e}`);
    return 0;
  }
};

//unable to get correct data from findOne , need to check it.
export const loginData = async (query: any) => {
  try {
    return await PlayerLoginData().findOne(query);
  } catch (e) {
    logger.error(`loginData , error ${e}`);
    return {};
  }
};

export const findTotalChipsAddedAggregate = async (
  query: findTotalChipsAddedQuery,
) => {
  try {
    return await TransactionHistory().aggregate([
      { $match: query },
      { $group: { _id: '$transferMode', amount: { $sum: '$amount' } } },
    ]);
  } catch (e) {
    logger.error(`findTotalChipsAddedAggregate , error ${e}`);
    return {};
  }
};

export const findUserOpts = async (
  filter: findUserOptsQuery | object,
  opts: object,
) => {
  try {
    return await Users().find(filter, opts);
  } catch (e) {
    logger.error(`findUserOpts , error ${e}`);
    return [];
  }
};
