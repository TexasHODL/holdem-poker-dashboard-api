import { Module } from '@nestjs/common';
import { BalanceSheetManagementService } from './balance-sheet.service';
import { BalanceSheetController } from './balance-sheet.controller';
import { UserModule } from '../user/user.module';
import { FinanceModule } from '../finance/finance.module';
import { DirectCashoutModule } from '../direct-cashout/direct-cashout.module';
import { TableModule } from '../table/table.module';
import { CashoutModule } from '../cashout/cashout.module';
import { TransactionHistoryModule } from '../transaction-history/transaction-history.module';
import { ChipsModule } from '../chips/chips.module';
import { PlayerRakeBackModule } from '../player-rake-back/player-rake-back.module';

@Module({
  imports: [
    UserModule,
    FinanceModule,
    DirectCashoutModule,
    TableModule,
    CashoutModule,
    TransactionHistoryModule,
    ChipsModule,
    PlayerRakeBackModule,
  ],
  controllers: [BalanceSheetController],
  providers: [BalanceSheetManagementService],
})
export class BalanceSheetModule {}
