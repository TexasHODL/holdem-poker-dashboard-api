import e, { query, Request } from 'express';
import { assign, get, isArray, isEmpty, isNumber, isObject } from 'lodash';
import { RESPONSE_CODES } from '../../constants';
import MESSAGES from '../../helpers/messages.error';
import randomize from 'randomatic';
import { fromObject, isPayloadValid } from '../../helpers/utils';
import {
  deleteLeaderboardSets,
  findLeaderboardSet,
  getCountOfLeaderboardSet,
  getLeaderboardSet,
  getOneLeaderboardSet,
  insertLeaderboardSet,
  leaderboardSetUpdate,
  listLeaderboardOpts,
  updateLeaderboard,
  updateLeaderboardViewInSet,
} from '../../model/queries/leaderboardSetManagement';
import {
  changeViewOfLeaderboardPayload,
  changeViewOfSetPayload,
  createLeaderboardSetPayload,
  deleteLeaderboardSetPayload,
  LeaderboardList,
  leaderboardSetArray,
  leaderboardSpecificDetailQuery,
  udpateLeaderboardSetQuery,
  updateDataType,
  updateLeaderboardSetPayload,
  updateQueryType,
} from './leaderboardSetManagementInterface';
import {
  changeViewOfLeaderboardRequest,
  changeViewOfSetRequest,
  createLeaderboardSetRequest,
  deleteLeaderboardSetRequest,
  updateLeaderboardSetRequest,
} from './leaderboardSetManagementType';
import logger from '../../logger';

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
 * Method return the count of Leaderboard sets
 * @method countLeaderboardSets
 */

export const countLeaderboardSets = async (req: Request) => {
  try {
    const query = {};
    const response: any = await getCountOfLeaderboardSet(query);
    if (isNumber(response)) {
      return {
        ...success_response,
        info: 'count of leaderboard set found.',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Error while counting the leaderboard sets',
      };
    }
  } catch (err) {
    logger.error(`countLeaderboardSets , error ${err}`);
    return catch_response;
  }
};

/**
 * This method gets the leaderboard sets
 * @method getLeaderboardSets
 */

export const getLeaderboardSets = async (req: Request) => {
  try {
    const query = { ...req.body };
    const response: any = await findLeaderboardSet(query);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...success_response,
        info: 'List of leaderboard set found',
        result: response,
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
        info: 'List of leaderboard set it empty',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Error while listing the leaderboard sets',
      };
    }
  } catch (err) {
    logger.error(`getLeaderboardSets , error ${err}`);
    return catch_response;
  }
};

/*
 *  This Method is used to check is requested leaderboardName already exist or not.
 */
const checkIfLeaderboardSetExist = async (
  params: createLeaderboardSetPayload,
) => {
  const query = { leaderboardSetName: get(params, 'leaderboardSetName') };
  const response: any = await getLeaderboardSet(query);
  console.log('response ===', response);
  if (isArray(response) && isEmpty(response)) {
    return {
      ...success_response,
      result: response,
    };
  } else if (isArray(response) && !isEmpty(response)) {
    return {
      ...error_response,
      info: 'leaderboard set already exist',
    };
  } else {
    return {
      ...error_response,
      info: 'Error in getting leaderboard details',
    };
  }
};

const assignSomeFieldsForEachLeaderboard = async (
  params: createLeaderboardSetPayload,
) => {
  try {
    const leaderboardArray = get(params, 'leaderboardArray');
    let query: updateQueryType = {};
    let updateData: updateDataType = {};
    leaderboardArray.forEach(async (selectedLeaderboard) => {
      if (get(selectedLeaderboard, '_id')) {
        delete selectedLeaderboard._id;
      }
      selectedLeaderboard.onView = false;
      if (selectedLeaderboard.leaderboardId) {
        query = { leaderboardId: selectedLeaderboard.leaderboardId };
        updateData = { usedInSet: true };
        const response: any = await updateLeaderboard(query, updateData);
        if (isEmpty(response)) {
          return {
            ...error_response,
            info: 'error while Assigning fields to each leaderboard',
            result: [],
          };
        }
      }
    });

    return {
      ...success_response,
      result: leaderboardArray,
    };
  } catch (err) {
    logger.error(`assignSomeFieldsForEachLeaderboard, error ${err}`);
    return {
      ...error_response,
      info: 'exception error while Assigning fields to each leaderboard',
      result: [],
    };
  }
};

const saveLeaderboardSetData = async (params: createLeaderboardSetPayload) => {
  const leaderboardSetData = {
    leaderboardSetName: params.leaderboardSetName,
    createdAt: params.createdAt,
    leaderboardList: params.leaderboardArray,
    leaderboardSetId: randomize('A0', 10),
    onView: false,
  };

  const response: any = await insertLeaderboardSet(leaderboardSetData);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'Leaderboard Set Created successfully',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error while creating leaderboard Set',
    };
  }
};

/**
 * This method is used to create leaderboard set
 * @method createLeaderboardSet
 */
export const createLeaderboardSet = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      createLeaderboardSetRequest as createLeaderboardSetPayload,
    ) as createLeaderboardSetPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      createLeaderboardSetRequest,
    );
    if (isValid) {
      const checkAlreayExists = await checkIfLeaderboardSetExist(
        requestPayload,
      );
      console.log('result  ====', checkAlreayExists);
      if (checkAlreayExists.success) {
        const assignSomeFields = await assignSomeFieldsForEachLeaderboard(
          requestPayload,
        );
        if (assignSomeFields.success) {
          requestPayload.leaderboardArray = assignSomeFields.result;
          return await saveLeaderboardSetData(requestPayload);
        } else {
          return assignSomeFields; // return error response
        }
      } else {
        return checkAlreayExists; //return error response
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'request payload is not valid',
      };
    }
  } catch (err) {
    logger.error(`createLeaderboardSet , error ${err}`);
    return catch_response;
  }
};

const updateSet = async (params: deleteLeaderboardSetPayload) => {
  try {
    const query: updateQueryType = {};
    const udpateData = { usedInSet: false };
    let response: any;
    const leaderboardList = get(params, 'leaderboardList');
    leaderboardList.forEach(async (leaderboard) => {
      if (leaderboard.leaderboardId) {
        query.leaderboardId = leaderboard.leaderboardId;
        response = await updateLeaderboard(query, udpateData);

        if (isEmpty(response)) {
          return {
            ...error_response,
            info: 'Error while updating leaderboard',
          };
        }
      }
    });

    return {
      ...success_response,
      info: 'leaderboard updated successfully',
    };
  } catch (err) {
    logger.error(`udpateSet , error ${err}`);
    return {
      ...error_response,
      info: 'Error while deleting this leaderboard',
    };
  }
};

const removeLeaderboardSets = async (params: deleteLeaderboardSetPayload) => {
  const deleteQuery = {
    leaderboardSetId: params.leaderboardSetId,
  };

  const response: any = await deleteLeaderboardSets(deleteQuery);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'successful deletion',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error while deleting this leaderboard sets',
    };
  }
};

/**
 * method used to delete leaderboardset from the database
 * @method deleteLeaderboardSet
 */
export const deleteLeaderboardSet = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      deleteLeaderboardSetRequest as deleteLeaderboardSetPayload,
    ) as deleteLeaderboardSetPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      deleteLeaderboardSetRequest,
    );
    if (isValid) {
      const updateLeaderboard = await updateSet(requestPayload);
      if (updateLeaderboard.success) {
        return await removeLeaderboardSets(requestPayload);
      } else {
        return updateLeaderboard; //return error response;
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'request payload is not valid',
      };
    }
  } catch (err) {
    logger.error(`deleteLeaderboardSet , error${err}`);
    return catch_response;
  }
};

/**
 * method used to get leaderboards specific details
 * @method getLeaderboardSpecificDetails
 */
export const getLeaderboardSpecificDetails = async (req: Request) => {
  try {
    const query: leaderboardSpecificDetailQuery = {};
    let fieldsForProjection = {};
    if (get(req, 'body.projectionFields')) {
      fieldsForProjection = get(req, 'body.projectionFields');
    }
    if (get(req, 'body.status')) {
      query.status = { $in: get(req, 'body.status') };
    }
    if (get(req, 'body.id')) {
      query._id = get(req, 'body.id');
    }
    if (get(req, 'body.usedInSet')) {
      query.usedInSet = get(req, 'body.usedInSet');
    }
    console.log('fieldsForProjection', fieldsForProjection);
    const response: any = await listLeaderboardOpts(query, fieldsForProjection);
    console.log('response ===', response);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...success_response,
        info: 'leaderboard specific details found successfully',
        result: response,
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
        info: 'No Leaderboard present.',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'Error while getting List.',
      };
    }
  } catch (err) {
    logger.error(`getLeaderboardSpecificDetails , error ${err}`);
    return catch_response;
  }
};

const getSpecificLeaderboardSet = async (params: changeViewOfSetPayload) => {
  const query = { leaderboardSetId: get(params, 'leaderboardSetId') };
  const response: any = await getOneLeaderboardSet(query);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'leaderboard set found',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'No leaderboard Set Found',
      result: {},
    };
  }
};

const changeViewStatusOfSet = async (params: changeViewOfSetPayload) => {
  const query = { leaderboardSetId: params.leaderboardSetId };
  const update = { onView: params.onView };
  const response: any = await leaderboardSetUpdate(query, update);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'Leaderboard Set updated.',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error while updating leaderboard Set.',
    };
  }
};

/**
 * This method change the status of the leaderboard Set which is used while displaying on
 * the website about that specific set.
 * @method changeViewOfSet
 */
export const changeViewOfSet = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      changeViewOfSetRequest as changeViewOfSetPayload,
    ) as changeViewOfSetPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      changeViewOfSetRequest,
    );
    if (isValid) {
      const getLeaderboardSet = await getSpecificLeaderboardSet(requestPayload);
      if (getLeaderboardSet.success) {
        requestPayload.leaderboardSet = getLeaderboardSet.result;
        return await changeViewStatusOfSet(requestPayload);
      } else {
        return getLeaderboardSet; //return error response.
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'invalid request payload',
      };
    }
  } catch (err) {
    logger.error(`changeViewOfSet , error ${err}`);
    return catch_response;
  }
};

export const changeViewOfLeaderboard = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      changeViewOfLeaderboardRequest as changeViewOfLeaderboardPayload,
    ) as changeViewOfLeaderboardPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      changeViewOfLeaderboardRequest,
    );
    if (isValid) {
      const query = {
        leaderboardSetId: requestPayload.leaderboardSetId,
        'leaderboardList.leaderboardId': requestPayload.leaderboardId,
      };
      const update = requestPayload.onView;
      const response: any = await updateLeaderboardViewInSet(query, update);
      if (!isEmpty(response)) {
        return {
          ...success_response,
          info: 'Leaderboard view status updated.',
          result: response,
        };
      } else {
        return {
          ...error_response,
          info: 'Error while updating view status.',
        };
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'request payload not valid',
      };
    }
  } catch (err) {
    logger.error(`changeViewOfLeaderboard , error ${err}`);
    return catch_response;
  }
};

const checkIfLeaderboardSetAlreadyExist = async (
  params: updateLeaderboardSetPayload,
) => {
  if (params.leaderboardSetName) {
    const query = { leaderboardSetName: params.leaderboardSetName };
    const response: any = await getLeaderboardSet(query);
    if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
      };
    } else if (isArray(response) && !isEmpty(response)) {
      return {
        ...error_response,
        info: 'leaderboard set with this name already exist!',
      };
    } else {
      return {
        ...error_response,
        info: 'error in checking leaderboard details',
      };
    }
  } else {
    return {
      ...success_response,
    };
  }
};

const getPreviousLeaderboardDetails = async (
  params: updateLeaderboardSetPayload,
) => {
  const query = { leaderboardSetId: params.leaderboardSetId };
  const response: any = await getOneLeaderboardSet(query);
  if (!isEmpty(response)) {
    params.previousSetData = response;
    const leaderboardList = get(params, 'previousSetData.leaderboardList');
    const updateData = { usedInSet: false };
    const query: updateQueryType = {};
    leaderboardList.forEach(async (selectedLeaderboard: LeaderboardList) => {
      if (selectedLeaderboard.leaderboardId) {
        query.leaderboardId = selectedLeaderboard.leaderboardId;
        const result = await updateLeaderboard(query, updateData);
        if (isEmpty(result)) {
          return {
            ...error_response,
            info: 'Error while updating leaderboard',
          };
        }
      }
    });

    return {
      ...success_response,
      result: params.previousSetData,
    };
  } else {
    return {
      ...error_response,
      info: 'Error in getting this leaderboard details',
    };
  }
};

const assignSomeFieldsToEachLeaderboard = async (
  params: updateLeaderboardSetPayload,
) => {
  try {
    const leaderboardArray = params.leaderboardArray;
    let query: updateQueryType = {};
    let updateData: updateDataType = {};
    const count = 0;
    leaderboardArray.forEach(async (selectedLeaderboard) => {
      selectedLeaderboard.onView = false;
      if (selectedLeaderboard.leaderboardId) {
        query = { leaderboardId: selectedLeaderboard.leaderboardId };
        updateData = { usedInSet: true };
        const response: any = await updateLeaderboard(query, updateData);
        if (isEmpty(response)) {
          return {
            ...error_response,
            info: 'error while Assigning fields to each leaderboard',
            result: [],
          };
        }
      }
    });

    return {
      ...success_response,
      result: leaderboardArray,
    };
  } catch (err) {
    logger.error(` assignSomeFieldsToEachLeaderboard , error ${err}`);
    return {
      ...error_response,
      info: 'exception error while Assigning fields to each leaderboard',
      result: [],
    };
  }
};

const updateLeaderboardSetData = async (
  params: updateLeaderboardSetPayload,
) => {
  const query = { leaderboardSetId: params.leaderboardSetId };
  const updateData: udpateLeaderboardSetQuery = {};
  if (get(params, 'previousSetData.leaderboardSetName')) {
    updateData.leaderboardSetName = get(
      params,
      'previousSetData.leaderboardSetName',
    );
  }
  updateData.editedAt = params.editedAt;
  updateData.leaderboardList = params.leaderboardArray;
  const response: any = await leaderboardSetUpdate(query, updateData);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'Leaderboard set udpated successfully',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error while updating this leaderboard set',
    };
  }
};

/**
 * method used to update the leaderboard set
 * @method updateLeaderboardSet
 */
export const updateLeaderboardSet = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      updateLeaderboardSetRequest as updateLeaderboardSetPayload,
    ) as updateLeaderboardSetPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      updateLeaderboardSetRequest,
    );
    if (isValid) {
      const checkAlreadyExists = await checkIfLeaderboardSetAlreadyExist(
        req.body,
      );
      if (checkAlreadyExists.success) {
        const getPreviousDetail = await getPreviousLeaderboardDetails(
          requestPayload,
        );
        if (getPreviousDetail.success) {
          const assignSomeFields = await assignSomeFieldsToEachLeaderboard(
            requestPayload,
          );
          if (assignSomeFields.success) {
            requestPayload.leaderboardArray = assignSomeFields.result;
            //console.log('ASSGING METHOD RESULT ==', assignSomeFields.result);
            return await updateLeaderboardSetData(requestPayload);
          } else {
            return assignSomeFields; //return error response
          }
        } else {
          return getPreviousDetail;
        }
      } else {
        return checkAlreadyExists; //return error resposne;
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'invalid request payload',
      };
    }
  } catch (err) {
    logger.error(`updateLeaderboardSet , error ${err}`);
    return catch_response;
  }
};
