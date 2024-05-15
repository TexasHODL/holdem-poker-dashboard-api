import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { BonusDataService } from '../bonus-chips/services/bonus-data/bonus-data.service';
import { UserService } from '../user/user.service';
import { BonusChipsModule } from '../bonus-chips/bonus-chips.module';
import { UserModule } from '../user/user.module';
import { PalyerBankDetailsModule } from '../palyer-bank-details/palyer-bank-details.module';
import { TransactionHistoryModule } from '../transaction-history/transaction-history.module';
import { DirectCashoutModule } from '../direct-cashout/direct-cashout.module';
import { DB } from '@/database/connections/db';
import { AdminDBModel, LogDBModel, PokerDBModel } from '@/database/connections/constants';
import { LoyalityPlayerModule } from '../loyality-player/loyality-player.module';
import { ScratchCardHistoryService } from './services/scratch-card-history/scratch-card-history.service';
import { GameActivityService } from './services/game-activity/game-activity.service';
import { TableModule } from '../table/table.module';
@Module({
  imports: [
    BonusChipsModule,
    UserModule,
    PalyerBankDetailsModule,
    TransactionHistoryModule,
    DirectCashoutModule,
    LoyalityPlayerModule,
    TableModule,
    DB.adminDbModels([
      AdminDBModel.TransactionHistory,
      AdminDBModel.ScratchCardHistory,
    ]),
    DB.logDbModels([
      LogDBModel.GameActivity
    ])
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    ScratchCardHistoryService,
    GameActivityService,
  ],
  exports: [
    CustomerService,
    ScratchCardHistoryService,
    GameActivityService],

})
export class CustomerModule { }
