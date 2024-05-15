import { ConnectionNames } from '@/constants/connections';
import { balanceSheetSchema } from '@/v1/model/schema/balanceSheet';
import { dailyBalanceSheetSchema } from '@/v1/model/schema/dailyBalanceSheet';
import { fundrakeSchema } from '@/v1/model/schema/fundrake';
import { playerRakeBackSchema } from '@/v1/model/schema/playerRakeBack';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { FinanceDbModel } from './constants';

export { FinanceDbModel };

export const FinanceDBModels: ModelDefinition[] = [
  {
    name: FinanceDbModel.DailyBalanceSheet,
    schema: dailyBalanceSheetSchema,
  },
  {
    name: FinanceDbModel.Fundrake,
    schema: fundrakeSchema,
  },
  {
    name: FinanceDbModel.BalanceSheet,
    schema: balanceSheetSchema,
  },
  {
    name: FinanceDbModel.PlayerRakeBack,
    schema: playerRakeBackSchema,
  },
];

export const InjectFinanceModel = (model: FinanceDbModel) =>
  InjectModel(model, ConnectionNames.PokerFinanceDb);
