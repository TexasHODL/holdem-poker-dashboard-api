import { Module } from '@nestjs/common';
import { ChipsService } from './chips.service';
import { ChipsController } from './chips.controller';
import { ChipsTransferService } from './services/chips-transfer/chips-transfer.service';
import { UserModule } from '@/modules/user/user.module';
import { SharedModule } from '@/shared/shared.module';
import { ChipsTransferHistoryService } from './services/chips-transfer-history/chips-transfer-history.service';
import { TransferToAffiliateHistoryService } from './services/transfer-to-affiliate-history/transfer-to-affiliate-history.service';
import { TransferToPlayerHistoryService } from './services/transfer-to-player-history/transfer-to-player-history.service';
import { ChipsTransactionService } from './services/chips-transaction/chips-transaction.service';
import { ChipsTransactionController } from './chips-transaction.controller';
import { PlayerPassbookModule } from '../player-passbook/player-passbook.module';
import { TransactionHistoryModule } from '../transaction-history/transaction-history.module';
import { FinanceModule } from '../finance/finance.module';
import { AdminDBModel } from '@/database/connections/admin-db';
import { AuthModule } from '../auth/auth.module';
import { DB } from '@/database/connections/db';

@Module({
  imports: [
    DB.adminDbModels([
      AdminDBModel.ChipstransferToPlayerHistory,
      AdminDBModel.ChipsTransferToAffiliateHistory,
    ]),
    AuthModule,
    UserModule,
    SharedModule,
    PlayerPassbookModule,
    TransactionHistoryModule,
    FinanceModule,
  ],
  controllers: [ChipsController, ChipsTransactionController],
  providers: [
    ChipsService,
    ChipsTransferService,
    ChipsTransferHistoryService,
    TransferToAffiliateHistoryService,
    TransferToPlayerHistoryService,
    ChipsTransactionService,
  ],
  exports: [
    ChipsService,
    ChipsTransferService,
    ChipsTransferHistoryService,
    TransferToAffiliateHistoryService,
    TransferToPlayerHistoryService,
    ChipsTransactionService,
  ],
})
export class ChipsModule {}
