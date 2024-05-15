import { getApp } from '@/app';
import { ConnectionNames } from '@/constants/connections';
import { getModelToken } from '@nestjs/mongoose';
import { AdminDBModel, FinanceDbModel, LogDBModel } from './constants';
import { DBModel } from './db';

export const getAdminModelToken = (model: AdminDBModel) => {
  return getModelToken(model, ConnectionNames.PokerAdminDb);
};

export const getDBModelToken = (model: DBModel) => {
  return getModelToken(model, ConnectionNames.PokerDB);
};

export const getFinanceModelToken = (model: FinanceDbModel) => {
  return getModelToken(model, ConnectionNames.PokerFinanceDb);
};

export const getLogModelToken = (model: LogDBModel) => {
  return getModelToken(model, ConnectionNames.LogDB);
};

export const getDBModel = (model: DBModel) =>
  getApp().get(getDBModelToken(model));
export const getAdminModel = (model: AdminDBModel) =>
  getApp().get(getAdminModelToken(model));
export const getFinanceModel = (model: FinanceDbModel) =>
  getApp().get(getFinanceModelToken(model));
export const getLogModel = (model: LogDBModel) =>
  getApp().get(getLogModelToken(model));

export const getDBUri = (dbName: string) => {
  if (process.env.MONGO_DB_QUERY && process.env.MONGO_DB_QUERY !== '') {
    return `${dbName}${process.env.MONGO_DB_QUERY}`;
  }

  return dbName;
};
