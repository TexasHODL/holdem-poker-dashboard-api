import { Module } from '@nestjs/common';
import { PullChipsService } from './pull-chips.service';
import { PullChipsController } from './pull-chips.controller';
import { UserModule } from '../user/user.module';
import { CashoutModule } from '../cashout/cashout.module';
import { DB } from '@/database/connections/db';
import { AdminDBModel } from '@/database/connections/constants';
import { SharedModule } from '@/shared/shared.module';
import { PlayerPassbookModule } from '../player-passbook/player-passbook.module';
import { FinanceModule } from "../finance/finance.module";
import { FinanceService } from "../finance/finance.service";

@Module({
  imports: [
    UserModule,
    CashoutModule,
    SharedModule,
    PlayerPassbookModule,
    FinanceModule,
    DB.adminDbModels([
      AdminDBModel.InstantChipsPulledHistory
    ])
  ],
  controllers: [PullChipsController],
  providers: [PullChipsService]
})
export class PullChipsModule {}
