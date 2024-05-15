import * as express from 'express';
import { RESPONSE_CODES } from '../../constants';
import { fromObject, isPayloadValid } from '../../helpers/utils';
import {
  createSpamWordDictionary,
  findSpamDictionary,
  updateSpamWords,
} from '../../model/queries/spamwords';
import { spamWordPayload, ParamsType } from './spamwordsInterface';
import { requestSpamPayload } from './spamwordsType';
import { get } from 'lodash';
import MESSAGES from '../../helpers/messages.error';
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

const checkAlreadyExists = async () => {
  const isExists = await findSpamDictionary();
  if (isExists.length > 0) {
    return { success: true, result: isExists };
  } else {
    return { success: false, result: [] };
  }
};

const updateSpamDictionary = async (_id: string, params: ParamsType) => {
  const query = params;
  await updateSpamWords(_id, query);
};

const createSpamDictionary = async (params: ParamsType) => {
  const query = params;
  await createSpamWordDictionary(query);
};

export const updateSpamWord = async (req: express.Request) => {
  try {
    const Payload = fromObject(req, requestSpamPayload as spamWordPayload);
    const { isValid, message } = isPayloadValid(Payload, requestSpamPayload);
    if (isValid) {
      const checkDictionaryExists = await checkAlreadyExists();

      if (checkDictionaryExists.success) {
        const _id = checkDictionaryExists.result[0]._id.toString();
        await updateSpamDictionary(_id, get(req, 'body.blockedWords'));
        return {
          ...RESPONSE_CODES[200],
          success: true,
          info: 'spam dictionary updated',
        };
      } else {
        await createSpamDictionary(get(req, 'body.blockedWords'));
        return {
          ...RESPONSE_CODES[200],
          success: true,
          info: 'spam dictionary updated',
        };
      }
    } else {
      return {
        ...RESPONSE_CODES[400],
        message,
        success: true,
        info: message,
      };
    }
  } catch (err) {
    logger.error(`udpateSpamWord , error ${err}`);
    return catch_response;
  }
};

// Method to list all the spam words.

export const listSpamWords = async (req: express.Request) => {
  try {
    const getAllSpamWords = await checkAlreadyExists();
    if (getAllSpamWords.success) {
      const blockWords = get(getAllSpamWords, 'result[0].blockedWords');
      blockWords.sort();
      // const spamWordsList = (getAllSpamWords.result[0].blockedWords =
      //   blockWords);
      return {
        ...RESPONSE_CODES[200],
        success: true,
        info: 'Spam words found',
        result: getAllSpamWords.result,
      };
    } else {
      return {
        ...RESPONSE_CODES[204],
        success: true,
        info: 'Spam list is empty',
      };
    }
  } catch (err) {
    logger.error(`listSpamWords , error ${err}`);
    return catch_response;
  }
};
