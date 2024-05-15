import { ParamsType } from '../../../controller/spamWords/spamwordsInterface';
import SpamWords from '../../schema/spamWords';
import logger from '../../../logger';

export const findSpamDictionary = async () => {
  try {
    return await SpamWords().find({});
  } catch (e) {
    logger.error(` findSpamDictionary , error ${e}`);
    return [];
  }
};

export const createSpamWordDictionary = async (params: ParamsType) => {
  try {
    return await SpamWords().create({ blockedWords: params });
  } catch (e) {
    logger.error(`createSpamWordDictionary , error ${e}`);
    return {};
  }
};

export const updateSpamWords = async (_id: string, params: ParamsType) => {
  try {
    return await SpamWords()
      .updateOne({ _id: _id }, { blockedWords: params })
      .catch((err) => {
        console.log('error', err);
      });
  } catch (e) {
    logger.error(`udpateSpamWords , error ${e}`);
    return {};
  }
};
