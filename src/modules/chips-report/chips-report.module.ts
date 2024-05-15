import { AdminDBModel } from '@/database/connections/admin-db';
import { DB } from '@/database/connections/db';
import { Module } from '@nestjs/common';
import { TransactionHistoryModule } from '../transaction-history/transaction-history.module';
import { ChipsReportController } from './chips-report.controller';
import { ChipsReportService } from './chips-report.service';

@Module({
  imports: [
    DB.adminDbModels([AdminDBModel.TransactionHistory]),
    TransactionHistoryModule,
  ],
  controllers: [ChipsReportController],
  providers: [ChipsReportService],
})
export class ChipsReportModule {}
