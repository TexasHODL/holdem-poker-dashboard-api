import { Request, response } from 'express';
import {
  isArray,
  isEmpty,
  isNumber,
  isObject,
  map,
  uniq,
  get,
  filter,
  difference,
} from 'lodash';
import { RESPONSE_CODES } from '../../constants';
import MESSAGES from '../../helpers/messages.error';
import { fromObject, fromParams, isPayloadValid } from '../../helpers/utils';
import {
  countPlayerBonusCodeUsedByPlayers,
  deleteExistingLeaderboard,
  findBonus,
  findBonusCodeUsedByPlayers,
  findBonusUsedByPlayersDirectEntry,
  findLeaderboard,
  findPlayerBonusDetails,
  findUser,
  getLeaderboardList,
  getLeaderboardParticipant,
  getTablesList,
  insertLeaderboard,
  updateBounsDataForDirectEntry,
  updateLeaderboardData,
} from '../../model/queries/leaderboardManagement';
import {
  bonusDetailsType,
  closedRaceResponseType,
  countDirectEntryHistoryPayload,
  createLeaderboardPayload,
  DataType,
  deleteLeaderboardPayload,
  directEntryHistoryPayload,
  directEntryPayload,
  editLeaderboardPayload,
  findParticipantParamsType,
  getTablesPayload,
  leaderboardParticipantsPayload,
  playerBonusDataArrayType,
  playerBonusDataType,
  playerDataType,
  playerObjectType,
  udpateDataType,
} from './leaderboardManagementInterface';
import {
  countDirectEntryHistoryRequest,
  createLeaderboardRequest,
  deleteLeaderboardRequest,
  directEntryHistoryRequest,
  directEntryRequest,
  editLeaderboardRequest,
  leaderboardParticipantsRequest,
} from './leaderboardManagementType';
import randomize from 'randomatic';
import { v4 as uuidv4 } from 'uuid';
import { Constants } from '../../helpers/configConstants';
import logger from '../../logger';

const success_response: any = {
  ...RESPONSE_CODES[200],
  success: true,
};

const error_response: any = {
  ...RESPONSE_CODES[400],
  success: false,
};

const catch_response: any = {
  ...RESPONSE_CODES[500],
  success: false,
  info: MESSAGES.API_FAILURE_MESSAGE,
};

1;

/**
 * This methods gets the leaderboard list present in db.
 * @method  listLeaderboard
 */
export const listLeaderboard = async (req: Request) => {
  try {
    let query: any = {};
    if (req.body.id) {
      query._id = req.body.id;
    }
    if (req.body.leaderboardName) {
      query.leaderboardName = eval("/^" + req.body.leaderboardName + "$/i");
    }
    if (req.body.leaderboardType) {
      query.leaderboardType = req.body.leaderboardType;
    }
    if (req.body.status) {
      query.status = req.body.status;
    }
    if (req.body.leaderboardId) {
      query.leaderboardId = req.body.leaderboardId;
    }
    const response: any = await getLeaderboardList(query);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...success_response,
        info: 'leaderboard list found',
        result: response,
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
        info: 'leaderboard list is empty',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Error while getting list!',
      };
    }
  } catch (err) {
    logger.error(`listLeaderboard , error ${err}`);
    return catch_response;
  }
};

/**
 * This methods gets the tables present in db.
 * @method  getTables
 */
export const getTables = async (req: Request) => {
  try {
    const query: getTablesPayload = {
      isActive: true,
    };
    if (get(req, 'body.isRealMoney')) {
      query.isRealMoney = get(req, 'body.isRealMoney');
    }

    const response: any = await getTablesList(query);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...success_response,
        info: 'Tables list found',
        result: response,
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
        info: 'Tables list is empty',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Something went wrong!! unable to get table',
      };
    }
  } catch (err) {
    logger.error(`getTables , error ${err}`);
    return catch_response;
  }
};

const manageCloseRace = async (
  params: createLeaderboardPayload | editLeaderboardPayload,
) => {
  if (
    params.leaderboardType === 'closedVip' ||
    params.leaderboardType === 'closedHand'
  ) {
    if (!params.bonusCode) {
      return {
        ...error_response,
        info: 'Kindly provide Bonus Code key in Closed Race.',
      };
    } else {
      const query = {
        codeName: params.bonusCode.toUpperCase(),
        status: 'Live',
      };
      const response: any = await findBonus(query);
      if (!isEmpty(response)) {
        if (response[0].status === 'EXPIRED') {
          return {
            ...error_response,
            info: 'Bonus Code is Expired.',
          };
        } else if (response[0].bonusCodeCategory.type != 'leaderboardEntry') {
          return {
            ...error_response,
          };
        } else {
          params.bonusCode = response[0].codeName;
          params.bonusId = response[0].bonusId;
          return {
            ...success_response,
            result: params,
          };
        }
      } else {
        return {
          ...error_response,
          info: "This bonus code doesn't Exist.",
        };
      }
    }
  } else {
    return {
      ...success_response,
      result: params,
    };
  }
};

//need to update any with custom interface.
const createLeaderboardData = async (params: any) => {
  const data: DataType = {
    leaderboardId: randomize('A0', 8),
    leaderboardName: params.leaderboardName,
    leaderboardType: params.leaderboardType,
    startTime: params.startTime,
    endTime: params.endTime,
    status: 'Waiting',
    minVipPoints: params.minVipPoints,
    minHands: params.minHands,
    noOfWinners: params.noOfWinners,
    createdBy: params.createdBy,
    tables: params.tables,
    payout: params.payout,
    totalPrizePool: params.totalPrizePool,
    usedInSet: false,
    percentAccumulation: params.percentAccumulation,
    minRake: 0,
    description: '',
    termsCondition: [],
  };
  if (params.description) {
    data.description = params.description;
  }
  if (params.termsCondition) {
    data.termsCondition = params.termsCondition;
  } else {
    data.termsCondition = [];
  }
  if (params.bonusCode) {
    data.bonusCode = params.bonusCode;
    data.bonusId = params.bonusId;
  }
  if (params.minRake) {
    data.minRake = params.minRake;
  }

  const response: any = await insertLeaderboard(data);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'Leaderboard created successfully',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error while creating leaderboard',
    };
  }
};

/**
 * This method is used to create new leaderboard.
 * @method createLeaderboard
 */
export const createLeaderboard = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      createLeaderboardRequest as createLeaderboardPayload,
    ) as createLeaderboardPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      createLeaderboardRequest,
    );
    if (isValid) {
      const checkClosedRace: closedRaceResponseType = await manageCloseRace(
        req.body,
      );
      if (checkClosedRace.success && !isEmpty(checkClosedRace.result)) {
        return await createLeaderboardData(checkClosedRace.result);
      } else {
        return checkClosedRace; //return error response
      }
    } else {
      return {
        ...RESPONSE_CODES[400],
        success: false,
        message: message,
        info: 'request payload is not valid!',
      };
    }
  } catch (err) {
    logger.error(`createLeaderboard , error ${err}`);
    return catch_response;
  }
};

const getSpecificLeaderboard = async (id: string) => {
  const query = { _id: id };
  const response: any = await findLeaderboard(query);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'leaderboard found',
      result: { leaderboardData: response },
    };
  } else {
    return {
      ...error_response,
      info: 'Leaderboard not found',
      result: { leaderboardData: {} },
    };
  }
};

const removeLeaderboard = async (params: deleteLeaderboardPayload) => {
  if (params.leaderboardData.status === 'Waiting') {
    const query = { _id: params.id };

    const response: any = await deleteExistingLeaderboard(query);
    if (!isEmpty(response)) {
      return {
        ...success_response,
        info: 'Leaderboard deleted successfully',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Error in deleting leaderboard!',
      };
    }
  }
};

/**
 * This method is used to delete the leaderboard.
 * @method deleteLeaderboard
 */
export const deleteLeaderboard = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      deleteLeaderboardRequest as deleteLeaderboardPayload,
    ) as deleteLeaderboardPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      deleteLeaderboardRequest,
    );
    if (isValid) {
      const findLeaderboard = await getSpecificLeaderboard(get(req, 'body.id'));
      if (findLeaderboard.success) {
        return await removeLeaderboard(req.body);
      } else {
        return findLeaderboard; //return error response
      }
    } else {
      return {
        ...error_response,
        message: message,
        info: 'Invalid parameters to delete leaderboard',
      };
    }
  } catch (err) {
    logger.error(`deleteLeaderboard , error ${err}`);
    return catch_response;
  }
};
//need to update any with custom interface.
const prepareUpdateData = async (params: any) => {
  try {
    if (
      get(params, 'leaderboardData.status') === 'Waiting' ||
      get(params, 'leaderboardData.status') === 'Running'
    ) {
      const updateData: udpateDataType = {
        leaderboardName: params.leaderboardName,
        minVipPoints: params.minVipPoints,
        minHands: params.minHands,
        leaderboardType: params.leaderboardType,
        termsCondition: params.termsCondition ? params.termsCondition : [],
        noOfWinners: params.noOfWinners,
        totalPrizePool: params.totalPrizePool,
        tables: params.tables,
        payout: params.payout,
        startTime: params.startTime,
        endTime: params.endTime,
        updatedBy: params.updatedBy,
        percentAccumulation: params.percentAccumulation,
      };

      if (params.description) {
        updateData.description = params.description;
      }
      if (
        params.leaderboardType == 'closedVip' ||
        params.leaderboardType == 'closedHand'
      ) {
        if (params.bonusCode) {
          updateData.bonusCode = params.bonusCode;
          updateData.bonusId = params.bonusId;
        } else {
          return {
            ...error_response,
            info: 'Kindly provide Bonus code for Closed VIP Race.',
            data: null,
          };
        }
      } else {
        updateData.bonusCode = '';
        updateData.bonusId = '';
      }

      return {
        ...success_response,
        data: updateData,
      };
    } else {
      return {
        ...error_response,
        info: 'Leaderboard can not be editable in Expired state',
        data: {},
      };
    }
  } catch (err) {
    logger.error(`prepareUpdateData , error ${err}`);
    return catch_response;
  }
};

const updateLeaderboard = async (id: string, updateData: udpateDataType) => {
  const query = { _id: id };
  const response: any = await updateLeaderboardData(query, updateData);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'Leaderboard updated successfully',
    };
  } else {
    return {
      ...error_response,
      info: 'Error occured in updating leaderboard!',
    };
  }
};

/**
 * Method to udpate the leaderboard .
 * @method editLeaderboard
 */
export const editLeaderboard = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      editLeaderboardRequest as editLeaderboardPayload,
    ) as editLeaderboardPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      editLeaderboardRequest,
    );
    if (isValid) {
      const getLeaderboard = await getSpecificLeaderboard(get(req, 'body.id'));

      if (getLeaderboard.success) {
        requestPayload.leaderboardData = getLeaderboard.result.leaderboardData;

        const closedVipRace: closedRaceResponseType = await manageCloseRace(
          requestPayload,
        );

        if (closedVipRace.success) {
          const prepareData: any = await prepareUpdateData(
            closedVipRace.result,
          );

          if (prepareData.success) {
            return await updateLeaderboard(
              get(req, 'body.id'),
              prepareData.data,
            );
          } else {
            return prepareData; //return error response
          }
        } else {
          return closedVipRace; //return error response
        }
      } else {
        return getLeaderboard; //return error response
      }
    } else {
      return {
        ...error_response,
        message: message,
        info: 'Invalid Request Payload!',
      };
    }
  } catch (err) {
    logger.error(`editLeaderboard , error ${err}`);
    return catch_response;
  }
};

const getPlayerInfo = async (params: directEntryPayload) => {
  const query = { userName: params.userName };
  const response: any = await findUser(query);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'user list',
      result: { playerInfo: response },
    };
  } else {
    return {
      ...error_response,
      info: 'no player found',
      result: { playerInfo: {} },
    };
  }
};

export const bonusDetail = async (params: directEntryPayload) => {
  const bonusQuery = {
    codeName: params.bonusCode,
    'bonusCodeCategory.type': 'leaderboardEntry',
    status: 'Live',
  };
  const response: any = await findBonus(bonusQuery);

  if (isArray(response) && !isEmpty(response)) {
    return {
      ...success_response,
      result: { bonusData: response[0] },
    };
  } else if (isArray(response) && isEmpty(response)) {
    return {
      ...success_response,
      result: { bonusData: response },
    };
  } else {
    return {
      ...error_response,
      info: 'Error in getting bonus details',
      result: { bonusData: {} },
    };
  }
};

const getPlayerBonusDetails = async (params: directEntryPayload) => {
  const playerBonusQuery = {
    playerId: get(params, 'playerData.playerId'),
  };
  const response: any = await findPlayerBonusDetails(playerBonusQuery);
  if (response) {
    return {
      ...success_response,
      info: 'player bonus details found ',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error occurred while getting player bonus code details',
      result: response,
    };
  }
};

/**
 * method used to check whether player has used this bonus code before or not.
 */

const checkIfBonusCodeAlreadyUsed = async (
  playerBonusData: any,
  bonusData: any,
) => {
  //need to replace any with custom interface.

  let playerDirectEntryNeeded;
  if (get(playerBonusData, 'result.bonus.length') != 0) {
    const bonusIdsUsedByPlayer = uniq(map(playerBonusData.bonus, 'bonusId'));
    if (bonusIdsUsedByPlayer.indexOf(bonusData.bonusId) != -1) {
      //if player has used this bonus code before.
      return {
        ...error_response,
        info: 'This bonus code has been already used by this player',
        result: null,
      };
    } else {
      playerDirectEntryNeeded = true;
      return {
        ...success_response,
        result: { playerDirectEntryNeeded: true },
      };
    }
  } else {
    // if player have not used any bonus code yet.
    playerDirectEntryNeeded = true;
    return {
      ...success_response,
      result: { playerDirectEntryNeeded: true },
    };
  }
};

const setExpiry = async (time: any) => {
  return time + Constants.BONUSEXPIRE_PERIOD_INDAYS * 24 * 60 * 60 * 1000;
};

export const createPlayerDirectEntry = async (
  bonusAlreadyUsed: any,
  playerData: any,
  bonusData: any,
) => {
  if (get(bonusAlreadyUsed, 'result.playerDirectEntryNeeded')) {
    const playerDirectEntryQuery = {
      playerId: get(playerData, 'result.playerInfo.playerId'),
    };
    const playerDirectEntryData = {
      bonusId: get(bonusData, 'result.bonusData.bonusId'),
      name: get(bonusData, 'result.bonusData.codeName'),
      unClaimedBonus: 0,
      instantBonusAmount: 0,
      claimedBonus: 0,
      uniqueId: uuidv4(),
      fromBackedn: true,
      expireStatus: 0,
      expiredAmt: 0,
      expireAt: await setExpiry(Number(new Date())),
    };

    const updateQuery = {
      bonus: playerDirectEntryData,
    };
    const response: any = await updateBounsDataForDirectEntry(
      playerDirectEntryQuery,
      updateQuery,
    );
    if (!isEmpty(response)) {
      return {
        ...success_response,
        info: 'Player direct entry successfull',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Error occured while giving the direct entry to this player in leaderboard',
      };
    }
  } else {
    return {
      ...error_response,
      info: 'Getting error while giving direct entry in leaderboard to the player',
    };
  }
};

/**
 * This API is used for the Direct Entry of player with Bonus code.
 * @method directEntryPlayer
 */
export const directEntryPlayer = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      directEntryRequest as directEntryPayload,
    ) as directEntryPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      directEntryRequest,
    );
    if (isValid) {
      const playerData = await getPlayerInfo(req.body);

      if (playerData.success) {
        requestPayload.playerData = playerData.result.playerInfo;

        const bonusData = await bonusDetail(requestPayload);

        if (bonusData.success) {
          const playerBonusData = await getPlayerBonusDetails(requestPayload);

          if (playerBonusData.success) {
            const bonusAlreadyUsed = await checkIfBonusCodeAlreadyUsed(
              playerBonusData,
              bonusData,
            );

            if (bonusAlreadyUsed.success) {
              return await createPlayerDirectEntry(
                bonusAlreadyUsed,
                playerData,
                bonusData,
              );
            } else {
              return bonusAlreadyUsed;
            }
          } else {
            return playerBonusData; //return error response
          }
        } else {
          return bonusData; //return error response
        }
      } else {
        return playerData; //return error response
      }
    } else {
      return {
        ...error_response,
        message: message,
        info: 'Invalid payload',
      };
    }
  } catch (err) {
    logger.error(`directEntryPlayer , error ${err}`);
    return catch_response;
  }
};

/**
 * method used to get the bonus code details and check whether the given bonus code exists or not.
 */
const getBonusDetails = async (
  params: countDirectEntryHistoryPayload | directEntryHistoryPayload,
) => {
  const bonusQuery = {
    codeName: params.bonusCode,
    'bonusCodeCategory.type': 'leaderboardEntry',
  };
  const response: any = await findBonus(bonusQuery);

  if (isArray(response) && !isEmpty(response)) {
    return {
      ...success_response,
      info: 'Bonus Code list is found',
      result: response[0],
    };
  } else if (isArray(response) && isEmpty(response)) {
    return {
      ...error_response,
      info: 'Bonus code is not found',
    };
  } else {
    return {
      ...error_response,
      info: 'Error occured while getting bonus code details',
      result: [],
    };
  }
};

const countPlayerBonusCodeUsedDetails = async (params: any) => {
  //need to update any with custom interface
  const bonusId = get(params, 'result.bonusId');
  const query = { 'bonus.bonusId': bonusId };
  const response: any = await countPlayerBonusCodeUsedByPlayers(query);
  if (isNumber(response)) {
    return {
      ...success_response,
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error occurred while getting player bonus code  details',
    };
  }
};

/**
 * Method to count the no. of records for direct entry history player
 * @method countDirectEntryHistory
 */
export const countDirectEntryHistory = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      countDirectEntryHistoryRequest as countDirectEntryHistoryPayload,
    ) as countDirectEntryHistoryPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      countDirectEntryHistoryRequest,
    );
    if (isValid) {
      const bonusDetail = await getBonusDetails(requestPayload);
      if (bonusDetail.success && !isEmpty(get(bonusDetail, 'result'))) {
        return await countPlayerBonusCodeUsedDetails(bonusDetail);
      } else if (bonusDetail.success && isEmpty(get(bonusDetail, 'result'))) {
        return {
          ...success_response,
          result: 0,
        };
      } else {
        return bonusDetail;
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'Invalid request payload',
      };
    }
  } catch (err) {
    logger.error(`countDirectEntryHistory , error ${err}`);
    return catch_response;
  }
};

/**
 * method used to get details of players who have used bonus code.
 */
const getPlayerBonusCodeUsedDetails = async (
  params: directEntryHistoryPayload,
) => {
  const query = {
    skip: get(params, 'skip'),
    limit: get(params, 'limit'),
    bonusId: get(params, 'bonusData.bonusId'),
  };

  const response: any = await findBonusUsedByPlayersDirectEntry(query);
  if (isArray(response) && !isEmpty(response)) {
    return {
      ...success_response,
      result: response,
    };
  } else if (isArray(response) && isEmpty(response)) {
    return {
      ...error_response,
      info: 'No records found!!',
    };
  } else {
    return {
      ...error_response,
      info: 'error in getting bonus used by players',
      result: [],
    };
  }
};

/**
 * method used to find the userName from playerId
 */
export const findUserNameFromPlayerId = async (
  params: directEntryHistoryPayload,
) => {
  try {
    const dataArray: playerBonusDataType[] = params.playerBonusData;
    for (let i = 0; i < dataArray.length; i++) {
      const query = { playerId: dataArray[i].playerId };
      const response: any = await findUser(query);
      if (!isEmpty(response)) {
        params.playerBonusData[i].userName = response.userName;
      }
    }
    return {
      ...success_response,
      info: 'direct entry history of player found',
      result: params,
    };
  } catch (err) {
    logger.error(`findUserNameFromPlayerId , error ${err}`);
    return {
      ...error_response,
      info: 'error in getting userName from playerId',
    };
  }
};

/**
 * API used to get the player direct entry history report on the basis of bonusCode
 * @method directEntryHistoryPlayer
 */
export const directEntryHistoryPlayer = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      directEntryHistoryRequest as directEntryHistoryPayload,
    ) as directEntryHistoryPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      directEntryHistoryRequest,
    );
    if (isValid) {
      const bonusDetail = await getBonusDetails(requestPayload);

      if (bonusDetail.success) {
        requestPayload.bonusData = get(bonusDetail, 'result');
        const bonusCodeUsed = await getPlayerBonusCodeUsedDetails(
          requestPayload,
        );

        if (bonusCodeUsed.success) {
          requestPayload.playerBonusData = get(bonusCodeUsed, 'result');
          return await findUserNameFromPlayerId(requestPayload);
        } else {
          return bonusCodeUsed; //return error response
        }
      } else {
        return bonusDetail; //return error response
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'Invalid request payload',
      };
    }
  } catch (err) {
    logger.error(`directEntryHsitoryPlayer , error ${err}`);
    return catch_response;
  }
};

const getLeaderboard = async (params: leaderboardParticipantsPayload) => {
  const query = { leaderboardId: params.leaderboardId };
  const response: any = await findLeaderboard(query);
  if (response) {
    return {
      ...success_response,
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error occured while getting the leaderboard details.',
    };
  }
};

const findParticipantOfLeaderboard = async (
  params: findParticipantParamsType,
) => {
  const query = { leaderboardId: get(params, 'leaderboardData.leaderboardId') };
  const response: any = await getLeaderboardParticipant(query);
  if (isArray(response) && !isEmpty(response)) {
    return {
      ...success_response,
      result: response,
    };
  } else if (isArray(response) && isEmpty(response)) {
    return {
      ...error_response,
      info: 'No participants found in Leaderboard',
      result: [],
    };
  } else {
    return {
      ...error_response,
      info: 'Error while fetching participants',
    };
  }
};

/**
 * This method is used in case of VIP Race only. It is used to find the no of player who has crossed min Vip criteria.
 */
const countPlayerCrossedVip = async (
  params: leaderboardParticipantsPayload,
) => {
  let tempParticipants = [];
  if (
    get(params, 'leaderboardData.leaderboardType') === 'openVip' ||
    get(params, 'leaderboardData.leaderboardType') === 'closedVip'
  ) {
    if (get(params, 'leaderboardData.minVipPoints')) {
      tempParticipants = filter(
        get(params, 'participantsArray'),
        (obj: any) => {
          return obj.total >= get(params, 'leaderboardData.minVipPoints');
        },
      );
    }
  } else {
    if (get(params, 'leaderboardData.minHands')) {
      tempParticipants = filter(
        get(params, 'participantsArray'),
        (obj: any) => {
          return obj.total >= get(params, 'leaderboardData.minHands');
        },
      );
    }
  }
  params.crossedVipCount = tempParticipants.length || 0;
  return params;
};

const sortParticipantsData = async (params: leaderboardParticipantsPayload) => {
  const participantsArray = get(params, 'participantsArray');
  if (participantsArray) {
    participantsArray.sort((a: any, b: any) => {
      if (a.total == b.total) {
        return b.myCount - a.myCount;
      }
      return b.total - a.total;
    });
  }

  params.participantsArray = participantsArray;
  return params;
};

/**
 * This method is used only in case of Closed Race. This is to get the player list who has used the bonus code for specific leaderboard.
 */
const getPlayerUsedCodeForClosedRace = async (
  params: findParticipantParamsType | leaderboardParticipantsPayload,
) => {
  const query = get(params, 'leaderboardData.bonusId');
  const response: any = await findBonusCodeUsedByPlayers(query);
  if (isArray(response)) {
    return {
      ...success_response,
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error while getting players bonus data',
    };
  }
};

const assignBonusPlayerInParticipants = async (
  params: leaderboardParticipantsPayload,
) => {
  const remainingPlayer = difference(
    map(params.playerBonusList, 'playerId'),
    map(map(params.participantsArray, '_id'), 'pId'),
  );
  if (remainingPlayer.length > 0) {
    remainingPlayer.forEach(async (playerId) => {
      const query = { playerId: playerId };
      const response: any = await findUser(query);
      const playerObject: any = {}; //need to update any with custom interface.
      if (isObject(response) && !isEmpty(response)) {
        playerObject._id = {
          userName: get(response, 'userName'),
          pId: get(response, 'playerId'),
        };
        playerObject.total = 0;
        playerObject.myCount = 0;
        playerObject.parentName = get(response, 'isParentUserName');
        params.participantsArray?.push(playerObject);
      } else {
        // ignore this case (mostly for bots)
        playerObject._id = {
          userName: 'Player',
          pId: '1',
        };
        playerObject.total = 0;
        playerObject.myCount = 0;
        params.participantsArray?.push(playerObject);
      }
    });

    return {
      result: params,
    };
  } else {
    return {
      result: params,
    };
  }
};

/**
 * method used to get the particular leaderboard details on the basis of leaderboard Name
 */
const getCurrentLeaderboard = async (
  params: leaderboardParticipantsPayload,
) => {
  const query = { leaderboardId: params.leaderboardId };
  const response: any = await findLeaderboard(query);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error occured while getting the leaderboard details.',
    };
  }
};

const checkLeaderboardType = async (params: leaderboardParticipantsPayload) => {
  if (
    get(params, 'leaderboardData.leaderboardType') === 'closedHand' ||
    get(params, 'leaderboardData.leaderboardType') === 'closedVip'
  ) {
    params.crossedVipCount = 0;
    params.participantsArray = [];
    return params;
  } else {
    params.showMessage = true;
    return params;
  }
};

/**
 * This method is used in case of Closed Race. It is used in case of waiting Leaderboard. This method assign data to the players of the
 * bonus list i.e. which have used bonus code for the closed race
 */
const addPlayersOfBonusList = async (
  params: leaderboardParticipantsPayload,
) => {
  if (
    get(params, 'leaderboardData.leaderboardType') === 'closedHand' ||
    get(params, 'leaderboardData.leaderboardType') === 'closedVip'
  ) {
    const playerBonusListLength = get(params, 'playerBonusList.length');
    const bonusList = params.playerBonusList;
    if (playerBonusListLength) {
      bonusList?.forEach(async (player) => {
        const data: any = {}; //need to updated any with custom interface.
        const query = { playerId: player.playerId };
        const response: any = await findUser(query);
        if (isEmpty(response)) {
          data._id = {
            userName: '',
            pId: '',
          };
          data.email = '';
          data.mobile = '';
          data.parentName = '';
          data.rank = 'N/A';
        } else if (!isEmpty(response)) {
          data._id = {
            userName: response.userName,
            pId: response.playerId,
          };
          data.email = response.email;
          data.mobile = response.mobile;
          data.parentName = response.isParentUserName;
          data.rank = 'N/A';
        } else {
          data._id = {
            userName: 'Player' + player.playerId,
            pId: player.playerId,
          };
          (data.email = 'no email'),
            (data.mobile = '0000000000'),
            (data.parentName = 'N/A'),
            (data.rank = 'N/A');
        }
        params.participantsArray?.push(data);
      });

      return {
        result: params,
      };
    } else {
      return {
        result: params,
      };
    }
  } else {
    return {
      result: params,
    };
  }
};

/**
 * method used to list the participants of the current leaderboard
 */

export const getCurrentLeaderboardParticipants = async (req: Request) => {
  try {
    const requestPayload: any = fromParams(
      req.params,
      leaderboardParticipantsRequest as leaderboardParticipantsPayload,
    ) as leaderboardParticipantsPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      leaderboardParticipantsRequest,
    );
    if (isValid) {
      if (requestPayload.status === 'Running') {
        const searchLeaderboard = await getLeaderboard(requestPayload);
        if (searchLeaderboard.success) {
          const result = get(searchLeaderboard, 'result');
          const data = { leaderboardData: result };
          if (
            result.leaderboardType === 'openVip' ||
            result.leaderboardType === 'openHand'
          ) {
            const findParticipants = await findParticipantOfLeaderboard(data);

            if (findParticipants.success) {
              requestPayload.participantsArray = get(
                findParticipants,
                'result',
              );
              requestPayload.leaderboardData = get(data, 'leaderboardData');
              const playerCrossedVip = await countPlayerCrossedVip(
                requestPayload,
              );
              const sortParticipants = await sortParticipantsData(
                playerCrossedVip,
              );
              return sortParticipants; //need to delete leaderboardId and status from final response.
            } else {
              return findParticipants; //return error response
            }
          } else if (
            result.leaderboardType === 'closedVip' ||
            result.leaderboardType === 'closedHand'
          ) {
            const getPlayerUsedCode = await getPlayerUsedCodeForClosedRace(
              data,
            );
            if (getPlayerUsedCode.success) {
              const findParticipants = await findParticipantOfLeaderboard(data);
              requestPayload.playerBonusList = get(getPlayerUsedCode, 'result');
              requestPayload.leaderboardData = get(findParticipants, 'result');
              if (findParticipants.success) {
                const assignBonus = await assignBonusPlayerInParticipants(
                  requestPayload,
                );
                const playerCrossedVip = await countPlayerCrossedVip(
                  assignBonus.result,
                );
                const sortParticipants = await sortParticipantsData(
                  playerCrossedVip,
                );
                return sortParticipants;
              } else {
                return findParticipants; //return errore response
              }
            } else {
              return getPlayerUsedCode; //return error response
            }
          } else {
            return {
              ...error_response,
              info: 'Leaderboard is of invalid type.',
            };
          }
        } else {
          return searchLeaderboard; //return error response
        }
      } else if (requestPayload.status === 'Waiting') {
        const getLeaderboard = await getCurrentLeaderboard(requestPayload);
        if (getLeaderboard.success) {
          requestPayload.leaderboardData = get(getLeaderboard, 'result');

          const checkLeaderboard = await checkLeaderboardType(requestPayload);
          const getPlayerUsedCode = await getPlayerUsedCodeForClosedRace(
            checkLeaderboard,
          );
          if (getPlayerUsedCode.success) {
            requestPayload.playerBonusList = get(getPlayerUsedCode, 'result');
            const addPlayers = await addPlayersOfBonusList(requestPayload);
            return addPlayers;
          } else {
            return getPlayerUsedCode;
          }
        } else {
          return getLeaderboard; //return error response.
        }
      } else {
        return {
          ...error_response,
          info: 'No leaderboard with this info found',
        };
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'invalid request payload!',
      };
    }
  } catch (err) {
    logger.error(`getCurrentLeaderboardParticipants , error ${err}`);
    return catch_response;
  }
};
