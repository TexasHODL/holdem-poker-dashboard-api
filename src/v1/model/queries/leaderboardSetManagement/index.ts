import {
  changeViewOfLeaderboardQuery,
  changeViewOfSetQuery,
  deleteLeaderboardSetQuery,
  getOneLeaderboardSetQuery,
  leaderboardSetDataType,
  leaderboardSpecificDetailQuery,
  udpateLeaderboardSetQuery,
  updateDataType,
  updateOnViewType,
  updateQueryType,
} from '../../../controller/leaderboardSetManagement/leaderboardSetManagementInterface';
import Leaderboard from '../../schema/leaderboard';
import LeaderboardSet from '../../schema/leaderboardSet';
import logger from '../../../logger';

export const getCountOfLeaderboardSet = async (query: object) => {
  try {
    return await LeaderboardSet().countDocuments(query);
  } catch (e) {
    logger.error(`getCountOfLeaderboardSet , error ${e}`);
    return {};
  }
};

export const findLeaderboardSet = async (query: any) => {
  try {
    const skip = query.skip;
    const limit = query.limit;
    delete query.skip;
    delete query.limit;
    return await LeaderboardSet().find(query).skip(skip).limit(limit);
  } catch (e) {
    logger.error(`findLeaderboardSet , error ${e}`);
    return {};
  }
};

export const getOneLeaderboardSet = async (
  query: getOneLeaderboardSetQuery | changeViewOfSetQuery,
) => {
  try {
    return await LeaderboardSet().findOne(query);
  } catch (e) {
    logger.error(`getOneLeaderboardSet , error ${e}`);
    return [];
  }
};

export const getLeaderboardSet = async (query: getOneLeaderboardSetQuery) => {
  try {
    return await LeaderboardSet().find(query);
  } catch (e) {
    logger.error(`getLeaderboardSet , error ${e}`);
    return {};
  }
};

export const updateLeaderboard = async (
  query: updateQueryType,
  updateData: updateDataType,
) => {
  try {
    return await Leaderboard().updateOne(query, { $set: updateData });
  } catch (e) {
    logger.error(`updateLeaderboard , error ${e}`);
    return {};
  }
};

export const insertLeaderboardSet = async (query: leaderboardSetDataType) => {
  try {
    return await LeaderboardSet().create(query);
  } catch (e) {
    logger.error(`insertLeaderboardSet , error ${e}`);
    return {};
  }
};

export const deleteLeaderboardSets = async (
  query: deleteLeaderboardSetQuery,
) => {
  try {
    return await LeaderboardSet().deleteOne(query);
  } catch (e) {
    logger.error(`deleteLeaderboardSets , error ${e}`);
    return {};
  }
};

export const listLeaderboardOpts = async (
  query: leaderboardSpecificDetailQuery,
  fieldsForProjection: any,
) => {
  try {
    return await Leaderboard().find(query, fieldsForProjection);
  } catch (e) {
    logger.error(`listLeaderboardOpts , error ${e}`);
    return {};
  }
};

export const leaderboardSetUpdate = async (
  query: changeViewOfSetQuery,
  updateData: updateOnViewType | udpateLeaderboardSetQuery,
) => {
  try {
    return await LeaderboardSet().updateOne(query, { $set: updateData });
  } catch (e) {
    logger.error(`leaderboardSetUdpate , error ${e}`);
    return {};
  }
};

export const updateLeaderboardViewInSet = async (
  query: changeViewOfLeaderboardQuery,
  updateData: boolean,
) => {
  try {
    return await LeaderboardSet().updateOne(query, {
      $set: { 'leaderboardList.$.onView': updateData },
    });
  } catch (e) {
    logger.error(`updateLeaderboardViewSet , error ${e}`);
    return {};
  }
};
