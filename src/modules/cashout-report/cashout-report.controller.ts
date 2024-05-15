import { Body, Controller, Post } from '@nestjs/common';
import { CashoutReportService } from './cashout-report.service';

@Controller('')
export class CashoutReportController {
  constructor(private readonly cashoutReportService: CashoutReportService) {}

  @Post('findDailyCashoutReport')
  findDailyCashoutReport(@Body() body: any) {
    return this.cashoutReportService.findDailyCashoutReport(body);
  }
  
  @Post('findDailyCashoutDateFilter')
  findDailyCashoutDateFilter(@Body() body: any) {
    return this.cashoutReportService.findDailyCashoutDateFilter(body);
  }

  @Post('monthlyCashoutReport')
  monthlyCashoutReport(@Body() body: any) {
    return this.cashoutReportService.monthlyCashoutReport(body);
  }

  @Post('dailyCashoutChart')
  dailyCashoutChart(@Body() body: any) {
    return this.cashoutReportService.dailyCashoutChart(body);
  }
}
