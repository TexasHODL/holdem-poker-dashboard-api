import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { BalanceSheetService } from './services/balance-sheet/balance-sheet.service';
import { DB } from '@/database/connections/db';
import { FundrakeService } from './services/fundrake/fundrake.service';
import { DailyBalanceSheetService } from './services/daily-balance-sheet/daily-balance-sheet.service';
import { FinanceDbModel } from '@/database/connections/constants';

@Module({
  imports: [
    DB.financeDbModels([
      FinanceDbModel.BalanceSheet,
      FinanceDbModel.DailyBalanceSheet,
      FinanceDbModel.Fundrake,
    ]),
  ],
  controllers: [FinanceController],
  providers: [
    FinanceService,
    BalanceSheetService,
    FundrakeService,
    DailyBalanceSheetService,
  ],
  exports: [BalanceSheetService, FundrakeService, DailyBalanceSheetService],
})
export class FinanceModule {}
