import { Module } from '@nestjs/common';
import { TransferController } from './transfer/transfer.controller';
import { TransferHistoryController } from './transfer-history/transfer-history.controller';
import { TransferHistoryService } from './services/transfer-history/transfer-history.service';
import { TransferService } from './services/transfer/transfer.service';
import { InstantBonusHistoryService } from './services/instant-bonus-history/instant-bonus-history.service';
// import {
//   InstantBonusHistory,
//   InstantBonusHistorySchema,
// } from './entities/instantBonusHistory.entity';
// import { AdminDb } from '@/database/connections/admin-db';
import { UserModule } from '../user/user.module';
import { DB, DBModel } from '@/database/connections/db';
import { BonusDataService } from './services/bonus-data/bonus-data.service';
import { PlayerPassbookModule } from '../player-passbook/player-passbook.module';
import { LoyaltyPointModule } from '../loyalty-point/loyalty-point.module';
import { ScheduledExpiryService } from './services/scheduled-expiry/scheduled-expiry.service';
import { FinanceModule } from '../finance/finance.module';
import { SharedModule } from '@/shared/shared.module';
import { FinanceDbModel } from '@/database/connections/constants';
import { BonusClaimService } from './services/bonus-claim/bonus-claim.service';
import { BonusChipsController } from './bonus-chips.controller';

@Module({
  imports: [
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
    // AdminDb.forFeature([
    //   { name: InstantBonusHistory.name, schema: InstantBonusHistorySchema }
    // ]),
  ],
  controllers: [
    TransferController,
    TransferHistoryController,
    BonusChipsController,
  ],
  providers: [
    TransferService,
    TransferHistoryService,
    InstantBonusHistoryService,
    BonusDataService,
    ScheduledExpiryService,
    BonusClaimService,
  ],
  exports: [
    TransferService,
    TransferHistoryService,
    InstantBonusHistoryService,
    BonusDataService,
    ScheduledExpiryService,
  ],
})
export class BonusChipsModule {}
