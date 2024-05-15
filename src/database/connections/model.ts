import { ConnectionNames } from '@/constants/connections';
import { balanceSheetSchema } from '@/v1/model/schema/balanceSheet';
import { ModelDefinition } from '@nestjs/mongoose';

export type ModelDefinitionCustom = ModelDefinition & {
  connection: string;
};
export enum DBModelNames {
  BalanceSheet = 'balanceSheet',
}

export const Models: ModelDefinitionCustom[] = [
  {
    name: DBModelNames.BalanceSheet,
    schema: balanceSheetSchema,
    connection: ConnectionNames.PokerFinanceDb,
  },
];
