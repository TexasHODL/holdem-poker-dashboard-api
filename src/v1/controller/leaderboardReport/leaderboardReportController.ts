import { Request } from 'express';
import { isArray, isEmpty } from 'lodash';
import { RESPONSE_CODES } from '../../constants';
import MESSAGES from '../../helpers/messages.error';
import {
  getCountOfleaderboard,
  getLeaderboardData,
} from '../../model/queries/learderboardReport';
import {
  getLeaderboardReportCountPayload,
  listLeaderboardPayload,
} from './leaderboardReportInterface';
import logger from '../../logger';

const catch_response: any = {
  ...RESPONSE_CODES[400],
  message: MESSAGES.API_FAILURE_MESSAGE,
  info: MESSAGES.API_FAILURE_MESSAGE,
};

const error_response: any = {
  ...RESPONSE_CODES[400],
  success: false,
};

const success_response: any = {
  ...RESPONSE_CODES[200],
  success: true,
};

/**
 * This method returns the leaderboard report.
 * @method listLeaderboardReport
 * @param req [req.body]
 * @returns   [ validate response]
 */
export const listLeaderboardReport = async (req: Request) => {
  try {
    const params = req.body;
    const query: listLeaderboardPayload = {};
    if (params.startTime) {
      query.startTime = params.startTime;
    }
    if (params.endTime) {
      query.endTime = params.endTime;
    }
    if (params.leaderboardId) {
      query.leaderboardId = params.leaderboardId;
    }
    if (params.leaderboardType) {
      query.leaderboardType = params.leaderboardType;
    }
    if (params.id) {
      query._id = params.id;
    }

    const skip = req.body.skip || 0;
    const limit = req.body.limit || 20;
    const response: any = await getLeaderboardData(query, skip, limit);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...success_response,
        info: 'Leaderboard report',
        result: response,
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
        info: 'No data of leaderboard found.',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Error while listing Leaderboard Reports.',
      };
    }
  } catch (err) {
    logger.error(`listLeaderboardReport , error ${err}`);
    return catch_response;
  }
};

/**
 * This method is used to get the count of Leaderboard report.
 * @method getLeaderboardReportCount
 */

export const getLeaderboardReportCount = async (req: Request) => {
  try {
    const params = req.body;
    const query: getLeaderboardReportCountPayload = {};
    if (params.startTime) {
      query.startTime = params.startTime;
    }
    if (params.endTime) {
      query.endTime = params.endTime;
    }
    if (params.leaderboardId) {
      query.leaderboardId = params.leaderboardId;
    }
    if (params.leaderboard) {
      query.leaderboardType = params.leaderboardType;
    }

    const response: any = await getCountOfleaderboard(query);
    if (response > 0) {
      return {
        ...success_response,
        info: 'leaderboard report count',
        result: response,
      };
    } else if (response === 0) {
      return {
        ...success_response,
        info: 'no records in leaderboad report',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Error from the server to get Report',
      };
    }
  } catch (err) {
    logger.error(`getLeaderboardReportCount , error ${err}`);
    return catch_response;
  }
};
