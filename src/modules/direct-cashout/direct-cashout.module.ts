import { Module } from '@nestjs/common';
import { DirectCashoutService } from './direct-cashout.service';
import { DirectCashoutController } from './direct-cashout.controller';
import { DirectCashoutHistoryService } from './services/direct-cashout-history/direct-cashout-history.service';
import { CashoutHistoryService } from './services/cashout-history/cashout-history.service';
import { AdminDBModel } from '@/database/connections/admin-db';
import { DB } from '@/database/connections/db';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    DB.adminDbModels([
      AdminDBModel.DirectCashout,
      AdminDBModel.DirectCashoutHistory,
      AdminDBModel.CashoutHistory,
    ]),
  ],
  controllers: [DirectCashoutController],
  providers: [
    DirectCashoutService,
    DirectCashoutHistoryService,
    CashoutHistoryService,
  ],
  exports: [
    DirectCashoutService,
    DirectCashoutHistoryService,
    CashoutHistoryService,
  ],
})
export class DirectCashoutModule {}
