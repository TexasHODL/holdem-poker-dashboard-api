import {
  bonusUsedbyPlayerQuery,
  DataType,
  directEntryUdpateQueryType,
  findBonusQueryType,
  findLeaderboardQuery,
  findPlayerBonusQueryType,
  findUserQuery,
  getTablesPayload,
  udpateDataType,
  udpateQueryType,
} from '../../../controller/leaderboardManagement/leaderboardManagementInterface';
import BonusCollection from '../../schema/bonusCollection';
import Leaderboard from '../../schema/leaderboard';
import Tables from '../../schema/tables';
import Users from '../../schema/users';
import Bonusdata from '../../schema/bonusdata';
import leaderboardParticipant from '../../schema/leaderboardParticipant';
import logger from '../../../logger';

export const getLeaderboardList = async (query: object) => {
  try {
    return await Leaderboard().find(query);
  } catch (err) {
    logger.error(`getLeaderboardList , error ${err}`);
    return {};
  }
};

export const getTablesList = async (query: getTablesPayload) => {
  try {
    return await Tables().find(query, {
      projection: { channelName: 1, smallBlind: 1, bigBlind: 1 },
    });
  } catch (err) {
    logger.error(`getTablesList , error ${err}`);
    return {};
  }
};

export const insertLeaderboard = async (query: DataType) => {
  try {
    return await Leaderboard().create(query);
  } catch (err) {
    logger.error(`insertLeaderboard , error ${err}`);
    return {};
  }
};

export const findLeaderboard = async (query: object | findLeaderboardQuery) => {
  try {
    return await Leaderboard().findOne(query);
  } catch (e) {
    logger.error(`findLeaderboard , error ${e}`);
    return {};
  }
};

export const deleteExistingLeaderboard = async (query: object) => {
  try {
    return await Leaderboard().findByIdAndDelete(query);
  } catch (e) {
    logger.error(`deleteExistingLeaderboard , error ${e}`);
    return {};
  }
};

export const countPlayerBonusCodeUsedByPlayers = async (query: object) => {
  try {
    return await Bonusdata().count(query);
  } catch (err) {
    logger.error(`countPlayerBonusCodeUsedByPlayers , error ${err}`);
    return {};
  }
};

export const updateLeaderboardData = async (
  query: udpateQueryType,
  udpateData: udpateDataType,
) => {
  try {
    return await Leaderboard().findByIdAndUpdate(query, udpateData);
  } catch (e) {
    logger.error(`udpateLeaderboardData , error ${e}`);
    return {};
  }
};

export const findUser = async (query: findUserQuery) => {
  try {
    return await Users().findOne(query);
  } catch (e) {
    logger.error(`findUser , error ${e}`);
    return {};
  }
};

export const findBonus = async (query: findBonusQueryType) => {
  try {
    return await BonusCollection().find(query);
  } catch (e) {
    logger.error(`findBonus , error ${e}`);
    return [];
  }
};

export const findPlayerBonusDetails = async (
  query: findPlayerBonusQueryType,
) => {
  try {
    return await Bonusdata().findOne(query);
    //return await Bonusdata().find(query);
  } catch (e) {
    logger.error(`findPlayerBonusDetails , error ${e}`);
    return e;
  }
};

export const updateBounsDataForDirectEntry = async (
  filter: findPlayerBonusQueryType,
  updateQuery: directEntryUdpateQueryType,
) => {
  try {
    const update = { $push: updateQuery };
    return await Bonusdata().updateOne(filter, update);
  } catch (e) {
    logger.error(`updateBounsDataForDirectEntry , error ${e}`);
    return {};
  }
};

export const findBonusUsedByPlayersDirectEntry = async (
  query: bonusUsedbyPlayerQuery,
) => {
  try {
    const skip = query.skip || 0;
    const limit = query.limit || 20;
    // return await Bonusdata().find(
    //   { 'bonus.bonusId': query.bonusId },
    //   'playerId bonus',
    //   { skip: skip, limit: limit },
    // );
    return await Bonusdata().find({ 'bonus.bonusId': query.bonusId }).skip(skip).limit(limit)
  } catch (e) {
    logger.error(`findBonusUsedByPlayersDirectory , error ${e}`);
    return { error: e };
  }
};

export const getLeaderboardParticipant = async (
  query: findLeaderboardQuery,
) => {
  try {
    return await leaderboardParticipant().find(query);
  } catch (e) {
    logger.error(`getLeaderboardParticipant , error ${e}`);
    return {};
  }
};

export const findBonusCodeUsedByPlayers = async (query: string) => {
  try {
    return await Bonusdata().find(
      { 'bonus.bonusId': query },
      { projection: { playerId: 1, 'bonus.$': 1 } },
    );
  } catch (e) {
    logger.error(`findBonusCodeUsedByPlayers , error ${e}`);
    return {};
  }
};
