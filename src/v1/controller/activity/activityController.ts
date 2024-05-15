import { Request } from 'express';
import {
  constant,
  isArray,
  isEmpty,
  isNumber,
  isObject,
  isString,
  lte,
  sum,
} from 'lodash';
import { RESPONSE_CODES } from '../../constants';
import {
  findTotalChipsAddedAggregate,
  findTotalRakeGenerated,
  findUserOpts,
  findUserSessionCountInDB,
  loginData,
} from '../../model/queries/activity';
import MESSAGES from '../../helpers/messages.error';
import {
  datesPayload,
  paramsDate,
  paramsType,
  PlayerDataResultType,
} from './activityInterface';
import logger from '../../logger';

const catch_response: any = {
  ...RESPONSE_CODES[400],
  success: false,
  info: MESSAGES.API_FAILURE_MESSAGE,
};

/**
 * This method calculate the total rake generated for yesterday.
 * @method findTotalRakeYesterday
 * @param req   [startDate & endDate]
 * @returns     [sum of rake]
 */

export const findTotalRakeYesterday = async (req: Request) => {
  try {
    const startDate = Number(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1,
        0,
        0,
        0,
        0,
      ),
    );
    const endDate = startDate + 1 * 24 * 60 * 60 * 1000;
    const query = { addeddate: { $gte: startDate, $lt: endDate } };

    const response: any = await findTotalRakeGenerated(
      query,
      '$rakeRefType',
      '$debitToCompany',
    );
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...RESPONSE_CODES[200],
        success: true,
        info: 'Total rake for yesterfday found',
        result: { sumOfRake: response[0].amount.toFixed(2) },
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...RESPONSE_CODES[200],
        succes: true,
        info: 'Total Rake for Yesterday',
        result: { sumOfRake: 0 },
      };
    } else {
      return {
        ...RESPONSE_CODES[400],
        success: false,
        info: response,
      };
    }
  } catch (err) {
    logger.error(`findTotalRakeYesterday , error ${err}`);
    return catch_response;
  }
};

const findTotalPlayersOnline = async () => {
  const query = {};
  return await findUserSessionCountInDB(query);
};

const setStartDateEndDateForYesterday = async () => {
  const startDate = Number(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
      0,
      0,
      0,
      0,
    ),
  );
  const endDate = startDate + 1 * 24 * 60 * 60 * 1000;
  return {
    startDate: startDate,
    endDate: endDate,
  };
};

const setStartDateEndDateForToday = async () => {
  const startDate = Number(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0,
      0,
    ),
  );
  const endDate = startDate + 1 * 24 * 60 * 60 * 1000;
  return {
    startDate: startDate,
    endDate: endDate,
  };
};

const findPlayerData = async (dates: datesPayload) => {
  const query = { startDate: dates.startDate, endDate: dates.endDate };
  const response: PlayerDataResultType = (await loginData(query)) as any;
  console.log('findPlayerData response ========>', response);

  if (isObject(response) && !isEmpty(response)) {
    return response.playerCount;
  } else if (isObject(response) && isEmpty(response)) {
    response.playerCount = 0;
    return response.playerCount;
  } else {
    return response;
  }
};

/**
 * This API is gives information that how many players are logged in Today and Yesterday.
 * @method findPlayerLoginData
 */

export const findPlayerLoginData = async (req: Request) => {
  try {
    console.log('inside findPlayerLogin Data ', JSON.stringify(req.body));
    const OnlinePlayers = await findTotalPlayersOnline();
    const datesForYesterday = await setStartDateEndDateForYesterday();
    const playersLoggedInYesterday = await findPlayerData(datesForYesterday);
    const datesForToday = await setStartDateEndDateForToday();
    const playersLoggedInToday = await findPlayerData(datesForToday);
    return {
      ...RESPONSE_CODES[200],
      success: true,
      info: 'player login data find successfully !',
      result: {
        onlinePlayers: OnlinePlayers,
        totalPlayersLoggedInYesterday: playersLoggedInYesterday || 0,
        totalPlayersLoggedInToday: playersLoggedInToday || 0,
      },
    };
  } catch (err) {
    logger.error(`findPlayerLoginData , error ${err}`);
    return catch_response;
  }
};

const getAggreateSumOfRake = async (startDate: number, endDate: number) => {
  const query = { addeddate: { $gte: startDate, $lt: endDate } };
  const response: any = await findTotalRakeGenerated(
    query,
    '$rakeRefType',
    '$debitToCompany',
  );
  return response;
};

/**
 * This API is used for getting information about rake generated last week.
 * @method findTotalRakeLastWeek
 */
export const findTotalRakeLastWeek = async (req: Request) => {
  try {
    const startDate = Number(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - new Date().getDay() - 7 + 1,
        0,
        0,
        0,
        0,
      ),
    );
    const endDate = startDate + 7 * 24 * 60 * 60 * 1000;
    const response: any = await getAggreateSumOfRake(startDate, endDate);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...RESPONSE_CODES[200],
        success: true,
        info: 'Total rake for last week ',
        result: { sumOfRake: response[0].amount.toFixed(2) },
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...RESPONSE_CODES[200],
        succes: true,
        info: 'Total Rake for last week',
        result: { sumOfRake: 0 },
      };
    } else {
      return {
        ...RESPONSE_CODES[400],
        success: false,
        info: response,
      };
    }
  } catch (err) {
    logger.error(`findTotalRakeLastWeek , error ${err}`);
    return catch_response;
  }
};

/**
 * This method is used to set the the start and end time which is being used for listing the rake
 * generated in the partial yesterday.
 * @method setStartTimeEndTimeForPartialYesterday
 */
const setStartTimeEndTimeForPartialYesterday = async (date: number) => {
  const startDate = Number(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
      0,
      0,
      0,
      0,
    ),
  );
  const endingDate = new Date(date);
  const endDate = Number(endingDate.setDate(endingDate.getDate() - 1));
  return {
    startDate: startDate,
    endDate: endDate,
  };
};

/**
 * This API gives the information about partial rake generated Today and Yesterday.
 * @method findPartialRakeGeneratedDay
 */

export const findPartialRakeGeneratedDay = async (req: Request) => {
  try {
    let partialRakeToday = 0;
    let partialRakeYesterday = 0;
    const startDate = Number(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0,
        0,
      ),
    );
    const endDate = Number(new Date());
    const todayRake = await getAggreateSumOfRake(startDate, endDate);

    if (isArray(todayRake) && !isEmpty(todayRake)) {
      partialRakeToday = todayRake[0].amount.toFixed(2);
    }

    const newTime = await setStartTimeEndTimeForPartialYesterday(endDate);
    const yesterdayRake = await getAggreateSumOfRake(
      newTime.startDate,
      newTime.endDate,
    );

    if (isArray(yesterdayRake) && !isEmpty(yesterdayRake)) {
      partialRakeYesterday = yesterdayRake[0].amount.toFixed(2);
    }

    return {
      ...RESPONSE_CODES[200],
      success: true,
      info: 'partial rake generated today and yesterday',
      result: {
        partialRakeToday,
        partialRakeYesterday,
      },
    };
  } catch (err) {
    logger.error(`findPartialRakeGeneratedDay , error ${err}`);
    return catch_response; // return error response
  }
};

/**
 * This method is used to set the the start and end time which is being used for listing the rake
 * generated in the partial last week.
 *
 * @method setStartTimeEndTimeForPartialLastWeek
 */

const setStartTimeEndTimeForPartialLastWeek = async (
  sDate: number,
  eDate: number,
) => {
  const startingDate = new Date(sDate);
  const startDate = Number(startingDate.setDate(startingDate.getDate() - 7));
  const endingDate = new Date(eDate);
  const endDate = Number(endingDate.setDate(endingDate.getDate() - 7));
  return {
    startDate: startDate,
    endDate: endDate,
  };
};

/**
 * This method is used to find the rake generated partially for the day, week, month & year. This data
 * is used in Activity module of Dashboard.
 *
 * @method calculatePartialRakeGenerated
 */
export const findPartialRakeGenerated = async (req: Request) => {
  try {
    const startDate = Number(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - new Date().getDay() + 1,
        0,
        0,
        0,
        0,
      ),
    );
    const endDate = Number(new Date());
    let partialRakeThisWeek = 0;
    let partialRakeLastWeek = 0;
    let averageRakeThisWeek = 0;

    const thisWeekRake = await getAggreateSumOfRake(startDate, endDate);
    if (isArray(thisWeekRake) && !isEmpty(thisWeekRake)) {
      partialRakeThisWeek = thisWeekRake[0].amount.toFixed(2);
      averageRakeThisWeek = partialRakeThisWeek / (new Date().getDay() || 1);
    } else if (isString(thisWeekRake)) {
      return {
        ...RESPONSE_CODES[400],
        success: false,
        info: thisWeekRake,
      };
    }

    const timeForlastWeek = await setStartTimeEndTimeForPartialLastWeek(
      startDate,
      endDate,
    );
    const lastWeekRake = await getAggreateSumOfRake(
      timeForlastWeek.startDate,
      timeForlastWeek.endDate,
    );
    if (isArray(lastWeekRake) && !isEmpty(lastWeekRake)) {
      partialRakeLastWeek = lastWeekRake[0].amount.toFixed(2);
    } else if (isString(lastWeekRake)) {
      return {
        ...RESPONSE_CODES[400],
        success: false,
        info: lastWeekRake,
      };
    }

    return {
      ...RESPONSE_CODES[200],
      success: true,
      info: 'partial rake this week and last week',
      result: {
        partialRakeThisWeek,
        partialRakeLastWeek,
        averageRakeThisWeek,
      },
    };
  } catch (err) {
    logger.error(`findPartialRakeGenerated , error ${err}`);
    return catch_response;
  }
};

/**
 * [set start and end date for last week]
 * @method setStartDateEndDateForLastWeek
 */
const setStartDateEndDateForLastWeek = async () => {
  const startDate = Number(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - new Date().getDay() - 7 + 1,
      0,
      0,
      0,
      0,
    ),
  );
  const endDate = startDate + 7 * 24 * 60 * 60 * 1000;
  return {
    startDate,
    endDate,
  };
};

/**
 * This method sets the start date and end date for today. End date is taken as partial means
 * when we hit the query that time is taken as end date.
 *
 * @method setStartDateEndDateForPartialToday
 */
const setStartDateEndDateForPartialToday = async () => {
  const startDate = Number(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0,
      0,
    ),
  );
  const endDate = Number(new Date());
  return {
    startDate,
    endDate,
  };
};

const setStartDateEndDateForPartialYesterday = async (eDate: number) => {
  const startDate = Number(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
      0,
      0,
      0,
      0,
    ),
  );
  const endingDate = new Date(eDate);
  const endDate = Number(endingDate.setDate(endingDate.getDate() - 1));
  return {
    startDate,
    endDate,
  };
};

/**
 * finds the total chips added .
 * @method findTotalChipsAdded
 */

const findTotalChipsAdded = async (sDate: number, eDate: number) => {
  const query = {
    status: 'SUCCESS',
    date: { $gte: sDate, $lt: eDate },
  };
  const response: any = (await findTotalChipsAddedAggregate(query)) as any;
  let sumOfChips = 0;
  if (isArray(response)) {
    response.forEach((element) => {
      sumOfChips += element.amount;
    });
    return { sumOfChips: sumOfChips };
  } else {
    return { sumOfChips: 'Unable to find total chips added' };
  }
};

const setStartDateEndDateForPartialThisWeek = async () => {
  const startDate = Number(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - new Date().getDay() + 1,
      0,
      0,
      0,
      0,
    ),
  );
  const endDate = Number(new Date());
  return {
    startDate,
    endDate,
  };
};

const setStartDateEndDateForPartialLastWeek = async (
  sDate: number,
  eDate: number,
) => {
  const startingDate = new Date(sDate);
  const startDate = Number(startingDate.setDate(startingDate.getDate() - 7));
  const endingDate = new Date(eDate);
  const endDate = Number(endingDate.setDate(endingDate.getDate() - 1));
  return {
    startDate,
    endDate,
  };
};

/**
 * Calculates chips added partial for dashboard.
 * @method calculateChipsAddedPartialForDashboard
 */

export const calculateChipsAddedPartialForDashboard = async (req: Request) => {
  try {
    const yesterday = await setStartDateEndDateForYesterday();
    const totalChipsAddedYesterday = await findTotalChipsAdded(
      yesterday.startDate,
      yesterday.endDate,
    );
    const lastWeek = await setStartDateEndDateForLastWeek();
    const totalChipsAddedLastWeek = await findTotalChipsAdded(
      lastWeek.startDate,
      lastWeek.endDate,
    );
    const partialToday = await setStartDateEndDateForPartialToday();
    const totalchipsAddedPartialToday = await findTotalChipsAdded(
      partialToday.startDate,
      partialToday.endDate,
    );
    const partialYesterday = await setStartDateEndDateForPartialYesterday(
      partialToday.endDate,
    );
    const totalchipsAddedPartialYesterday = await findTotalChipsAdded(
      partialYesterday.startDate,
      partialYesterday.endDate,
    );
    const partialThisWeek = await setStartDateEndDateForPartialThisWeek();
    const totalChipsAddedPartialThisWeek = await findTotalChipsAdded(
      partialThisWeek.startDate,
      partialThisWeek.endDate,
    );
    const partialLastWeek = await setStartDateEndDateForPartialLastWeek(
      partialThisWeek.startDate,
      partialThisWeek.endDate,
    );
    const totalChipsAddedPartialLastWeek = await findTotalChipsAdded(
      partialLastWeek.startDate,
      partialLastWeek.endDate,
    );
    return {
      ...RESPONSE_CODES[200],
      success: true,
      info: 'Total chips added data found ',
      result: {
        totalChipsAddedYesterday: totalChipsAddedYesterday.sumOfChips,
        totalChipsAddedLastWeek: totalChipsAddedLastWeek.sumOfChips,
        totalchipsAddedPartialToday: totalchipsAddedPartialToday.sumOfChips,
        totalchipsAddedPartialYesterday:
          totalchipsAddedPartialYesterday.sumOfChips,
        totalChipsAddedPartialThisWeek:
          totalChipsAddedPartialThisWeek.sumOfChips,
        totalChipsAddedPartialLastWeek:
          totalChipsAddedPartialLastWeek.sumOfChips,
      },
    };
  } catch (err) {
    logger.error(`calculateChipsAddedPartialForDashboard , error ${err}`);
    return catch_response;
  }
};

/**
 * This method sets the start date and end date for partial month which is going on.
 *
 * @method setStartTimeEndTimeForPartialMonth
 */
const setStartTimeEndTimeForPartialMonth = async (params: paramsDate) => {
  const startingDate = new Date(params.startDate);
  const startDate = Number(startingDate.setDate(1));
  const endDate = Number(new Date());
  return {
    startDate,
    endDate,
  };
};

const setStartTimeEndTimeForPartialYear = async (params: paramsDate) => {
  const startingDate = new Date(params.startDate);
  startingDate.setDate(1);
  startingDate.setMonth(0);
  const startDate = Number(startingDate);
  const endDate = Number(new Date());

  return {
    startDate,
    endDate,
  };
};

/**
 * This method gives the data of the all player which have joined beetween the given time period.
 *
 * @method findAllPlayersJoinData
 */
const findAllPlayersJoinData = async () => {
  const query = {};
  const filter = {};
  const response: any = await findUserOpts(filter, query);
  return response.length;
};

/**
 * This method gives the data of the new player which have joined beetween the given time period.
 * @method findNewPlayerJoinData
 */

const findNewPlayerJoinData = async (params: paramsDate) => {
  const query = { createdAt: { $gte: params.startDate, $lt: params.endDate } };
  const response: any = await findUserOpts(query, {});
  return response.length;
};

/**
 * This method find the new player login data. It consist of series of function which finds total
 * online player and then set the start date and end date for month and year and find the player
 * data accordingly.
 *
 * @method findNewPlayersJoinData
 */

export const findNewPlayersJoinData = async (req: Request) => {
  try {
    const datePartialToday = await setStartDateEndDateForPartialToday();
    const newPlayersToday = await findNewPlayerJoinData(datePartialToday);
    const datePartialMonth = await setStartTimeEndTimeForPartialMonth(
      datePartialToday,
    );
    const newPlayersThisMonth = await findNewPlayerJoinData(datePartialMonth);
    const datePartialYear = await setStartTimeEndTimeForPartialYear(
      datePartialMonth,
    );
    const newPlayersThisYear = await findNewPlayerJoinData(datePartialYear);
    const allPlayersJoinData = await findAllPlayersJoinData();

    return {
      ...RESPONSE_CODES[200],
      success: true,
      info: 'New players join data found',
      result: {
        newPlayersToday,
        newPlayersThisMonth,
        newPlayersThisYear,
        allPlayersJoinData,
      },
    };
  } catch (err) {
    logger.error(`findNewPlayersJoinData , error ${err}`);
    return catch_response;
  }
};
