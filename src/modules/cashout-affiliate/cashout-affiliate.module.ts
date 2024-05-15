import { Module } from '@nestjs/common';
import { CashoutAffiliateService } from './cashout-affiliate.service';
import { CashoutAffiliateController } from './cashout-affiliate.controller';
import { DB, DBModel } from '@/database/connections/db';
import { AdminDBModel } from '@/database/connections/constants';
import { CashoutModule } from '../cashout/cashout.module';
import { DirectCashoutModule } from '../direct-cashout/direct-cashout.module';
import { UserModule } from '../user/user.module';
import { SharedModule } from '@/shared/shared.module';
import { PlayerPassbookModule } from '../player-passbook/player-passbook.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [
    UserModule,
    SharedModule,
    DB.pokerDbModels([
      DBModel.User,
    ]),
    DB.adminDbModels([
      AdminDBModel.Affiliates,
      AdminDBModel.DirectCashout,
      AdminDBModel.DirectCashoutHistory,
      AdminDBModel.PendingCashOutRequest
    ]),
    CashoutModule,
    DirectCashoutModule,
    PlayerPassbookModule,
    FinanceModule
  ],
  controllers: [CashoutAffiliateController],
  providers: [CashoutAffiliateService],
  exports: [CashoutAffiliateService]
})
export class CashoutAffiliateModule {}
