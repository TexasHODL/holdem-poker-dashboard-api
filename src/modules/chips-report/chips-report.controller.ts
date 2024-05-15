import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChipsReportService } from './chips-report.service';
import { DailyChipsChart } from './dto/daily-chips-chart';
import { DailyChipsReport } from './dto/daily-chips-report';
import { ListMonthlyBonusChipsReport } from './dto/list-monthly-bonus-chips-report';
import { MonthlyChipsReport } from './dto/monthly-chips-report';

@ApiTags('chips-report')
@Controller('')
export class ChipsReportController {
  constructor(private readonly chipsReportService: ChipsReportService) {}

  @Post('dailyChipsReport')
  dailyChipsReport(@Body() dailyChipsReport: DailyChipsReport) {
    return this.chipsReportService.dailyChipsReport(dailyChipsReport);
  }

  @Post('countDataForDailyChips')
  countDataForDailyChips(@Body() body: DailyChipsReport) {
    return this.chipsReportService.countDataInTransactionHistory(body);
  }

  @Post('monthlyChipsReport')
  monthlyChipsReport(@Body() monthlyChipsReport: MonthlyChipsReport) {
    return this.chipsReportService.monthlyChipsReport(monthlyChipsReport);
  }

  @Post('dailyChipsChart')
  dailyChipsChart(@Body() dailyChipsChart: DailyChipsChart) {
    console.log(1);
    return this.chipsReportService.dailyChipsChart(dailyChipsChart);
  }

  @Post('listMonthlyBonusChipsReport')
  listMonthlyBonusChipsReport(@Body() body: ListMonthlyBonusChipsReport) {
    return this.chipsReportService.listMonthlyBonusChipsReport(body);
  }
}
