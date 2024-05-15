import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RakeAnalyticsService } from './rake-analytics.service';
import { CreateRakeAnalyticDto } from './dto/create-rake-analytic.dto';
import { UpdateRakeAnalyticDto } from './dto/update-rake-analytic.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Rake Analytics')
@ApiBearerAuth()
@Controller('')
export class RakeAnalyticsController {
  constructor(private readonly rakeAnalyticsService: RakeAnalyticsService) {}

  @Post('listRakeDataRakeReport')
  listRakeDataRakeReport(@Body() body: any) {
    return this.rakeAnalyticsService.listRakeDataRakeReport(body);
  }

  @Post('countlistRakeDataForRakeReport')
  countlistRakeDataForRakeReport(@Body() body: any) {
    return this.rakeAnalyticsService.countRakeDataForRakeReport(body);
  }

  @Post('generateDailyRakeChart')
  generateDailyRakeChart(@Body() body: any) {
    return this.rakeAnalyticsService.generateDailyRakeChartProcess(body);
  }

  @Post('countlistRakeDataByDate')
  countlistRakeDataByDate(@Body() body: any) {
    return this.rakeAnalyticsService.getRakeDataCountByDate(body);
  }

  @Post('listRakeDataPlayerByDate')
  listRakeDataPlayerByDate(@Body() body: any) {
    return this.rakeAnalyticsService.rakeDataProcessPlayerByDate(body);
  }

  @Post('countRake')
  countRake (@Body() Body: any) {
    return this.rakeAnalyticsService.countRake(Body);
  }

  @Post('listRakeDataAffiliatesByDate')
  listRakeDataAffiliatesByDate(@Body() body: any) {
    return this.rakeAnalyticsService.rakeDataProcessAffiliatesByDate(body);
  }

  @Post('listRakeDataPlayerByPlayerOrAffiliate')
  listRakeDataPlayerByPlayerOrAffiliate(@Body() body: any) {
    return this.rakeAnalyticsService.rakeDataProcessPlayerByPlayerOrAffiliate(body);
  }

  @Post('listAllCashTable')
  listAllCashTable(@Body() body: any) {
    return this.rakeAnalyticsService.getAllCashTablesProcess(body);
  }

  @Post('listRakeDataByGameVariant')
  listRakeDataByGameVariant(@Body() body: any) {
    return this.rakeAnalyticsService.listRakeDataByGameVariantProcess(body);
  }

  @Post('generateRakeByTimeChart')
  generateRakeByTimeChart(@Body() body: any) {
    return this.rakeAnalyticsService.generateRakeChartByTimeProcess(body);
  }

  @Post('listRakeDataDatewise')
  listRakeDataDatewise(@Body() body: any) {
    return this.rakeAnalyticsService.rakeDataProcessDatewise(body);
  }

  @Post('countCashTables')
  countCashTables(@Body() body: any) {
    return this.rakeAnalyticsService.rakeDataProcessDatewise(body);
  }

  @Post('listEachCashTableRakeData')
  listEachCashTableRakeData(@Body() body: any) {
    return this.rakeAnalyticsService.listEachCashTableRakeDataProcess(body);
  }

  @Post('listRakeDataAffiliatesByPlayerOrAffiliate')
  listRakeDataAffiliatesByPlayerOrAffiliate(@Body() body: any) {
    return this.rakeAnalyticsService.rakeDataProcessAffiliatesByPlayerOrAffiliate(body);
  }

  @Post('countlistRakeDataByCashTable')
  countlistRakeDataByCashTable(@Body() body: any) {
    return this.rakeAnalyticsService.countRakeDataByCashTable(body);
  }

  @Post('listRakeDataByCashTable')
  listRakeDataByCashTable(@Body() body: any) {
    return this.rakeAnalyticsService.listRakeDataByCashTableProcess(body);
  }

  @Post('listRakeBackMonthlyReport')
  listRakeBackMonthlyReport(@Body() body: any) {
    return this.rakeAnalyticsService.listRakeBackMonthlyReport(body);
  }

  @Post('countRakeDataForRakeReportAffiliate')
  countRakeDataForRakeReportAffiliate(@Body() body: any) {
    return this.rakeAnalyticsService.countRakeDataForRakeReportAffiliates(body);
  }

  @Post('listRakeDataForRakeReportAffiliate')
  listRakeDataForRakeReportAffiliate(@Body() body: any) {
    return this.rakeAnalyticsService.listRakeDataForRakeReportAffiliates(body);
  }
}