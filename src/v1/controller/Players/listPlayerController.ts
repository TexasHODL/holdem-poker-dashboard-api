import * as express from 'express';
import { PlayerListRequestPayLoad } from './player.interface';
import { playerListRequest } from './player.type';
import {
  fromObject,
  toObject,
  isPayloadValid,
  requiredValidation,
  buildAffliateQueryObject,
} from '../../helpers/utils';
import { RESPONSE_CODES } from '../../constants';
import {
  validateAffliate,
  validateAffliateEmail,
  createUser as createUserRecord,
  getAffliatesList,
  getAffliatesCount,
  createAffiliateRecord,
  createSubAffiliateRecord,
} from '../../model/queries/auth';
import { generateToken } from '../../helpers/jwt';
import {
  createSessionForLoggedInUser,
  validateUserSession,
} from '../../model/queries/loggedInAffiliates';
import { isEmpty, get } from 'lodash';
import MESSAGES from '../../helpers/messages.error';
import { decrypt } from '../../helpers/crypto';

const catch_response: any = {
  ...RESPONSE_CODES[400],
  message: MESSAGES.API_FAILURE_MESSAGE,
  info: MESSAGES.API_FAILURE_MESSAGE,
};

export const listPlayers = async (req: express.Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      playerListRequest as PlayerListRequestPayLoad,
    ) as PlayerListRequestPayLoad;
  } catch (e) {
    return catch_response;
  }
};

export const toggleShowPassword = (showPassword: boolean) => {
  return !showPassword;
};
