import { Request } from 'express';
import { get, isArray, isEmpty, isNumber, set } from 'lodash';
import { RESPONSE_CODES } from '../../constants';
import { fromObject, isPayloadValid } from '../../helpers/utils';
import {
  bonusDepositCount,
  deletePromoBonus,
  findActiveBonus,
  findBonus,
  findBonusHistoryCollection,
  findPromoBonus,
  saveBonusCode,
  savePromoBonus,
  udpateBonus,
  ValidatePromoBonus,
} from '../../model/queries/bonusCode';
import {
  addPromoBonusPayload,
  BonusCodePayload,
  bonusCodeType,
  codeNameType,
  UpdatePayload,
} from './bonusCodeInterface';
import {
  addPromoBonusRequest,
  BonusCodePayloadType,
  updateBonusRequest,
} from './BonusCodeType';
import MESSAGES from '../../helpers/messages.error';
import logger from '../../logger';
import * as uuid from 'uuid';

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
 * @method checkBonusAlreadyExists
 * This method is used to check the bonus is already exist or not.
 */
const checkBonusAlreadyExists = async (query: codeNameType | bonusCodeType) => {
  const result = await findBonus(query);
  if (!isEmpty(result)) {
    return true;
  } else {
    return false;
  }
};

/**
 *
 * @method createNewBonusCode
 * This method is used to create new Bonus code.
 */
const createNewBonusCode = async (query: BonusCodePayload) => {
  const result = await saveBonusCode(query);
  return {
    ...success_response,
    info: 'Bonus Code Generated',
    result: result,
  };
};

/**
 * @method createBonusCode
 * This method is used to create new Bonus Code.
 */
export const createBonusCode = async (req: Request) => {
  try {
    set(req, 'body.totalUsed', 0);
    let query;

    const requestPayload: any = fromObject(
      req,
      BonusCodePayloadType as BonusCodePayload,
    ) as BonusCodePayload;
    console.log(requestPayload)
    const { isValid, message } = isPayloadValid(
      requestPayload,
      BonusCodePayloadType,
    );

    if (isValid) {

      if (get(req, 'body.bonusCodeType.type') === 'signUp') {
        query = { bonusCodeType: { type: 'signup' }, status: 'Live' };
      } else {
        query = { codeName: get(req, 'body.codeName'), status: 'Live' };
      }

      if (get(req, 'body.bonusCodeCategory.type') == 'leaderboardEntry') {
        set(req, 'body.usedInLeaderboard', false);
        if (get(req, 'body.instantCap') || get(req, 'body.lockedCap')) {
          delete req.body.instantCap;
          delete req.body.lockedCap;
        }
      }

      const checkBonusExists = await checkBonusAlreadyExists(query);

      set(req, 'body.bonusId', uuid.v4());
      if (!checkBonusExists) {
        return await createNewBonusCode({
          ...req.body,
        });
      } else {
        return {
          ...error_response,
          info: 'Bonus code already exists!',
        };
      }
    } else {
      return {
        ...error_response,
        message,
        info: message,
      };
    }
  } catch (err) {
    logger.error(`createBonusCode , error ${err}`);
    return catch_response;
  }
};

/**
 * @method updateBonusCode
 * This method is used to updade the existing bonus code.
 */
export const updateBonusCode = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      updateBonusRequest as UpdatePayload,
    ) as UpdatePayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      updateBonusRequest,
    );

    if (isValid) {
      const query = { _id: get(req, 'body._id') };
      const updateData: UpdatePayload = {
        updatedBy: get(req, 'body.updatedBy'),
        updatedByRole: get(req, 'body.updatedByRole'),
        tag: get(req, 'body.tag'),
        tagDescription: get(req, 'body.tagDescription'),
        validTill: get(req, 'body.validTill'),
      };
      await udpateBonus(query, updateData);
      return {
        ...success_response,
        info: 'Bonus code udpated successfully',
      };
    } else {
      return {
        ...error_response,
        message,
        info: 'error in updation',
      };
    }
  } catch (err) {
    logger.error(`updateBonusCode , error ${err}`);
    return catch_response;
  }
};

/**
 * @method instantBonusExpire
 * This method is used to expire the bonus code.
 */
export const instantBonusExpire = async (req: Request) => {
  try {
    const query = { _id: get(req, 'params.id') };
    const udpateData = { status: 'EXPIRED' };
    const result = await udpateBonus(query, udpateData);
    if (!isEmpty(result)) {
      return {
        ...success_response,
        info: 'bonus code expired',
      };
    } else {
      return {
        ...error_response,
        info: 'error in instant bonus expire',
      };
    }
  } catch (err) {
    logger.error(` instantBonusExpire , error${err}`);
    return catch_response;
  }
};

/** Method to check Promo Bonus is Valid.
 *  @method checkValidPromoBonus
 */
const checkValidPromoBonus = async (params: addPromoBonusPayload) => {
  const query = { username: params.promoCode };
  const response: any = await ValidatePromoBonus(query);
  if (response.length === 0 || response[0].role.level > 0) {
    return {
      ...error_response,
      info: `PromoCode not found`,
    };
  } else {
    if (response[0].status === 'Block') {
      return {
        ...error_response,
        info: `This ${response[0].role.name} is blocked`,
      };
    } else {
      return {
        success: true,
        result: params,
      };
    }
  }
};

/**
 * @method insertPromoBonus
 * This method is used to insert new Promo bonus or update the amount of existing promo bonus.
 */
const insertPromoBonus = async (params: addPromoBonusPayload) => {
  const query = { promoCode: params.promoCode, amount: params.amount };
  const response: any = await savePromoBonus(query);
  if (response) {
    return {
      ...success_response,
      info: 'promo bonus saved successfully',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'error in insert promo bonus',
    };
  }
};

/**
 * This method is used to add new promo bonus.
 * @method addPromotionalBonus
 */
export const addPromotionalBonus = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      addPromoBonusRequest as addPromoBonusPayload,
    ) as addPromoBonusPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      addPromoBonusRequest,
    );

    if (isValid) {
      const params = req.body;
      //const checkPromoBonus = await checkValidPromoBonus(params);
      const checkPromoBonus = { success: true }; //for testing becasue affiliate data is not avaiable currently

      if (checkPromoBonus.success) {
        return await insertPromoBonus(params);
      } else {
        return checkPromoBonus;
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'request payload is not valid',
      };
    }
  } catch (err) {
    logger.error(` addPromotionalBonus , error ${err}`);
    return catch_response;
  }
};

/**
 * @method listPromotionalBonus
 * This method is used to list out all the Promotional bonus exist in db.
 */
export const listPromotionalBonus = async (req: Request) => {
  try {
    const query = {};
    const response: any = await findPromoBonus(query);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...success_response,
        info: 'list of promo bonus',
        result: response,
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
        info: 'promo bonus list is empty',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'no promo bonus exists',
        result: response,
      };
    }
  } catch (err) {
    logger.error(` listPromotionalBonus , error ${err}`);
    return catch_response;
  }
};

/**
 * @method removePromotionalBonus
 * @param    [ '_id of promo bonus document' ]
 * This method is used to remove specific promo bonus.
 */
export const removePromotionalBonus = async (req: Request) => {
  try {
    const query = { _id: req.params.id };
    const removeBonus = await deletePromoBonus(query);
    if (!isEmpty(removeBonus)) {
      return {
        ...success_response,
        info: 'promo bonus deleted',
        result: removeBonus,
      };
    } else {
      return {
        ...error_response,
        info: 'error in promo bonus deletion',
      };
    }
  } catch (err) {
    logger.error(`removePromotionalBonus , error ${err}`);
    return catch_response;
  }
};

/**
 * @method countBonusDeposit
 * This is method is used to get the count of bonus deposited.
 */
export const countBonusDeposit = async (req: Request) => {
  try {
    const query = {};
    const countBonus = await bonusDepositCount(query);
    if (isNumber(countBonus)) {
      return {
        ...success_response,
        info: 'number of bonus deposit count',
        result: countBonus,
      };
    } else {
      return {
        ...error_response,
        info: 'error in getting in count bonus deposit',
      };
    }
  } catch (err) {
    logger.error(` countBonusDeposit , error ${err}`);
    return catch_response;
  }
};

/**
 * @method listBonusDeposit
 * This is method is used to get the list of bonus deposited.
 */
export const listBonusDeposit = async (req: Request) => {
  try {

    // if(req.body.createdBy){
    //   req.body.createdBy = eval('/^'+ req.body.createdBy +'$/i');
    // }
    // if(!req.body.keyFromDashboard){
    //   req.body.status = "Live";
    // }

    const query = {...req.body};
    const bonusList = await findBonus(query);
    if (isArray(bonusList)) {
      return {
        ...success_response,
        info: 'list of bonus deposit',
        result: bonusList,
      };
    } else {
      return {
        ...error_response,
        info: 'error in getting bonus deposit list',
        result: bonusList,
      };
    }
  } catch (err) {
    logger.error(` listBonusDeposit , error ${err}`);
    return catch_response;
  }
};

/**
 * listBonusHistory method lists all bonus codes
 * @method listBonusHistory
 */
export const getBonusHistory = async (req: Request) => {
  //need to verify the req.body from existing code

  try {
    const query = req.body;
    const response: any = await findBonusHistoryCollection(query);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...success_response,
        info: 'successfully found the list of bonus bistory',
        result: response,
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
        info: 'bonus history list is empty',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'error in list bonus history',
      };
    }
  } catch (err) {
    logger.error(`getBonusHistory , error ${err}`);
    return catch_response;
  }
};

const getActiveBonusCode = async (params: any) => {
  const bonusCodeType = { type: 'signUp' };
  const query = { status: 'Live', bonusCodeType: bonusCodeType };
  const response: any = await findActiveBonus(query);
  if (isArray(response) && !isEmpty(response)) {
    return {
      ...success_response,
      info: 'active bonus code found successfully',
      result: response[0].codeName,
    };
  } else if (isArray(response) && isEmpty(response)) {
    return {
      ...success_response,
      info: 'no bonus code exists',
    };
  } else {
    return {
      ...error_response,
      info: 'error in getting active bonus code!',
    };
  }
};

/**
 * this api is used for getactive bonus code
 * @method getActiveBonus
 */
export const getActiveBonus = async (req: Request) => {
  try {
    const requestBody = req.body;
    return await getActiveBonusCode(requestBody);
  } catch (err) {
    console.log(`getActiveBonus , error ${err}`);
    return error_response;
  }
};
