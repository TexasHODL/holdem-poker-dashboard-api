import {
  findLeaderboardQueryPayload,
  listLeaderboardPayload,
} from '../../../controller/leaderboardReport/leaderboardReportInterface';
import LeaderboardWinners from '../../schema/leaderboardWinners';
import Leaderboard from '../../schema/leaderboard';
import leaderboardParticipant from '../../schema/leaderboardParticipant';
import logger from '../../../logger';

export const getLeaderboardData = async (
  query: listLeaderboardPayload,
  skip: number,
  limit: number,
) => {
  try {
    return await LeaderboardWinners()
      .find(query).skip(skip).limit(limit)
      .sort({ endTime: -1 });
  } catch (e) {
    logger.error(`getLeaderboardData , error ${e}`);
    return [];
  }
};

export const getCountOfleaderboard = async (query: object) => {
  try {
    return await LeaderboardWinners().estimatedDocumentCount(query);
  } catch (e) {
    logger.error(`getCountOfleaderboard , error ${e}`);
    return {};
  }
};

export const findLeaderboard = async (query: findLeaderboardQueryPayload) => {
  try {
    return await Leaderboard().findOne(query);
  } catch (e) {
    logger.error(`findLeaderboard , error ${e}`);
    return {};
  }
};

export const getLeaderboardParticipant = async (
  query: findLeaderboardQueryPayload,
) => {
  try {
    return await leaderboardParticipant().findOne(query);
  } catch (e) {
    logger.error(`getLeaderboardParticipant , error ${e}`);
    return {};
  }
};
