import { Module } from '@nestjs/common';
import { CashoutService } from './cashout.service';
import { CashoutController } from './cashout.controller';
import { PendingCashoutRequestService } from './services/pending-cashout-request/pending-cashout-request.service';
import { ApproveCashoutRequestService } from './services/approve-cashout-request/approve-cashout-request.service';
import { DB } from '@/database/connections/db';
import { AdminDBModel } from '@/database/connections/constants';
import { DirectCashoutModule } from '../direct-cashout/direct-cashout.module';

@Module({
  imports: [
    DB.adminDbModels([
      AdminDBModel.PendingCashOutRequest,
      AdminDBModel.ApproveCashOutRequest,
      AdminDBModel.Deposit
    ]),
    DirectCashoutModule,
  ],
  controllers: [CashoutController],
  providers: [
    CashoutService,
    PendingCashoutRequestService,
    ApproveCashoutRequestService,
  ],
  exports: [
    CashoutService,
    PendingCashoutRequestService,
    ApproveCashoutRequestService,
  ],
})
export class CashoutModule {}
