import { Module } from "@nestjs/common";
import { TransactionHistoryReportController } from "./transaction-history-report.controller";
import { TransactionHistoryReportService } from "./service/transaction-history-report.service";
import { AdminDBModel } from "@/database/connections/admin-db";
import { TransactionHistoryService } from "./services/transaction-history/transaction-history.service";
import { DB } from "@/database/connections/db";

@Module({
  imports: [
    DB.adminDbModels([AdminDBModel.TransactionHistory, AdminDBModel.Deposit]),
  ],
  controllers: [TransactionHistoryReportController],
  providers: [TransactionHistoryReportService, TransactionHistoryService],
  exports: [TransactionHistoryService, TransactionHistoryReportService],
})
export class TransactionHistoryModule {}
