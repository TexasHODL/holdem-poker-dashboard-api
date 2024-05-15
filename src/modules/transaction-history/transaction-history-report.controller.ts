import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CountDataInTransactionHistoryDto } from "./dto/count-data-in-transaction-history.dto";
import { ListTransactionHistoryDto } from "./dto/list-transaction-history.dto";
import { TransactionHistoryReportService } from "./service/transaction-history-report.service";
import { ListDepositInvoiceDto } from "./dto/list-deposit-invoice.dto";
import { CountDepositInvoiceDto } from "./dto/count-deposit-invoice.dto";

@ApiTags("Transaction History Report")
@Controller("")
export class TransactionHistoryReportController {
  constructor(
    private readonly transactionHistoryReportService: TransactionHistoryReportService
  ) {}

  @Post("listTransactionHistory")
  playerRakeBack(@Body() listTransactionHistoryDto: ListTransactionHistoryDto) {
    return this.transactionHistoryReportService.getTransactionHistory(
      listTransactionHistoryDto
    );
  }

  @Post("countDataInTransactionHistory")
  countDataForRakeBack(
    @Body() countDataInTransactionHistoryDto: CountDataInTransactionHistoryDto
  ) {
    return this.transactionHistoryReportService.countDataInTransactionHistory(
      countDataInTransactionHistoryDto
    );
  }

  @Post("listDepositInvoice")
  listDepositInvoice(@Body() listDepositInvoiceDto: ListDepositInvoiceDto) {
    return this.transactionHistoryReportService.listDepositInvoice(
      listDepositInvoiceDto
    );
  }

  @Post("countDepositInvoice")
  countDepositInvoice(@Body() countDepositInvoiceDto: CountDepositInvoiceDto) {
    return this.transactionHistoryReportService.countDepositInvoice(
      countDepositInvoiceDto
    );
  }
}
