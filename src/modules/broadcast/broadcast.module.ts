import { Module } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { BroadcastController } from './broadcast.controller';
import { SharedModule } from '@/shared/shared.module';
import { FinanceDbModel } from '@/database/connections/constants';
import { DB, DBModel } from '@/database/connections/db';
import { FinanceModule } from '../finance/finance.module';
import { LoyaltyPointModule } from '../loyalty-point/loyalty-point.module';
import { PlayerPassbookModule } from '../player-passbook/player-passbook.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [BroadcastController],
  providers: [BroadcastService],
  imports:[
    SharedModule,
    UserModule,
    PlayerPassbookModule,
    LoyaltyPointModule,
    FinanceModule,
    DB.pokerDbModels([
      DBModel.InstantBonusHistory,
      DBModel.BonusData,
      DBModel.ScheduledExpiry,
    ]),
    DB.financeDbModels([FinanceDbModel.BalanceSheet]),
  ]
})
export class BroadcastModule {}
