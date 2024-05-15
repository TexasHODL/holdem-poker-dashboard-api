import {
  approveScratchCardData,
  BalanceSheetQueryType,
  createDepositQueryType,
  deleteQuery,
  findPlayerQuery,
  findUserQuery,
  rejectScratchCardData,
  saveScratchCardAffiliateDetails,
  updateDepositQuery,
} from '../../../controller/scratchCard/scratchCardInterface';
import affiliates from '../../schema/affiliates';
import BalanceSheet from '../../schema/balanceSheet';
import ScratchCardHistory from '../../schema/scratchCardHistory';
import ScratchCardPending from '../../schema/scratchCardPending';
import TransactionHistory from '../../schema/transactionHistory';
import Users from '../../schema/users';
import logger from '../../../logger';

export const findUser = async (query: findUserQuery) => {
  try {
    return await affiliates().find(query);
  } catch (e) {
    logger.error(`findUser , error ${e}`);
    return [];
  }
};

export const createScratchCard = async (
  query: saveScratchCardAffiliateDetails,
) => {
  try {
    return await ScratchCardPending().create(query);
  } catch (e) {
    logger.error(`createScratchCard , error ${e}`);
    return {};
  }
};

export const getScratchCardCount = async (query: any) => {
  try {
    delete query.skip;
    delete query.limit;
    return await ScratchCardPending().count(query);
  } catch (e) {
    logger.error(`getScratchCardCount , error ${e}`);
    return {};
  }
};

export const findPlayer = async (query: findUserQuery) => {
  try {
    return await Users().find(query);
  } catch (e) {
    logger.error(`findPlayer , error ${e}`);
    return [];
  }
};

export const listScratchCard = async (query: any) => {
  try {
    let skip = query.skip || 0;
    let limit = query.limit || 0;
    delete query.skip;
    delete query.limit;
    let params = {};
    if(query.createdBy){
      params['createdBy.userName'] = { $regex: query.createdBy, $options: 'i' };
    }
    console.log(params)
    return await ScratchCardPending().find(params).skip(skip).limit(limit).sort({ ['createdAt']: -1 });
  } catch (e) {
    logger.error(`listScratchCard , error ${e}`);
    return {};
  }
};

export const scratchCardHistoryCount = async (query: any) => {
  try {
    delete query.skip;
    delete query.limit;
    return await ScratchCardHistory().count(query);
  } catch (e) {
    logger.error(`scratchCardHistoryCount , error ${e}`);
    return {};
  }
};

export const scratchCardHistoryList = async (query: any) => {
  try {
    let skip = query.skip || 0;
    let limit = query.limit || 0;
    let sortValue = query.sortValue;
    delete query.sortValue;
    delete query.skip;
    delete query.limit;

    return await ScratchCardHistory().find(query).skip(skip).limit(limit).sort({ [sortValue]: -1 });
  } catch (e) {
    logger.error(`scratchCardHistoryList, error ${e}`);
    return [];
  }
};

export const deleteScratchCard = async (query: deleteQuery) => {
  try {
    return await ScratchCardPending().findByIdAndDelete(query);
  } catch (e) {
    logger.error(`deleteScratchCard , error ${e}`);
    return {};
  }
};

export const insertInScratchCardHistory = async (
  query: rejectScratchCardData | approveScratchCardData,
) => {
  try {
    return await ScratchCardHistory().create(query);
  } catch (e) {
    logger.error(`insertInScratchCardHistory , error ${e}`);
    return {};
  }
};

export const createTransactionHistory = async (
  query: createDepositQueryType,
) => {
  try {
    return await TransactionHistory().create(query);
  } catch (e) {
    logger.error(`createTransactionHistory , error ${e}`);
    return {};
  }
};

export const findPlayerToSendMail = async (query: findPlayerQuery) => {
  try {
    return await Users().findOne(query);
  } catch (e) {
    logger.error(`findPlayerToSendMail , error ${e}`);
    return [];
  }
};

export const findPlayerToSendMobie = async (query: any) => {
  try {
    return await Users().findOne(query);
  } catch (error) {
    logger.error(`findPlayerToSendMail , error ${error}`);
    return [];
  }
}

export const updateBalanceSheet = async (
  filter: object,
  query: BalanceSheetQueryType,
) => {
  try {
    return await BalanceSheet.updateMany(filter, query);
  } catch (e) {
    logger.error(`updateBalanceSheet , error ${e}`);
    return {};
  }
};

export const updateDeposit = async (
  filter: object,
  query: updateDepositQuery,
) => {
  try {
    return await affiliates().updateMany(filter, query);
  } catch (e) {
    logger.error(`updateDeposit , error ${e}`);
    return {};
  }
};
