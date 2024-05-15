import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlayerReportService } from './player-report.service';
import { CreatePlayerReportDto } from './dto/create-player-report.dto';
import { UpdatePlayerReportDto } from './dto/update-player-report.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoyalityReportService } from './services/loyality-report/loyality-report.service';
import { PlayerLockedBonusInfoService } from '../user/services/player-locked-bonus-info/player-locked-bonus-info.service';
import { PlayerLockedBonusClaimedService } from '../user/services/player-locked-bonus-claimed/player-locked-bonus-claimed.service';
import { PlayerHandHistoryService } from '../user/services/player-hand-history/player-hand-history.service';
import { SendHandHistoryToMailDto } from './dto/sendHandHistoryToMail.dto';

@ApiTags('Player report management')
@ApiBearerAuth()
@Controller('')
export class PlayerReportController {
  constructor(
    private readonly playerReportService: PlayerReportService,
    private readonly loyalityReportService: LoyalityReportService,
    private readonly playerLockedBonusInfoService: PlayerLockedBonusInfoService,
    private readonly playerLockedBonusClaimedService: PlayerLockedBonusClaimedService,
    private readonly playerHandHistoryService: PlayerHandHistoryService,
  ) {}

  @Post('countPlayerReport')
  countPlayerReport(@Body() dto: any) {
    return this.playerReportService.countPlayerReport(dto);
  }

  @Post('findPlayersReport')
  findPlayersReport(@Body() dto: any) {
    return this.playerReportService.listPlayers(dto);
  }

  @Post('findPlayerDataChart')
  findPlayerDataChart(@Body() dto: any) {
    return this.playerReportService.findPlayerDataChart(dto);
  }

  @Post('findPlayerDataChartGamesPlayed')
  findPlayerDataChartGamesPlayed(@Body() dto: any) {
    return this.playerReportService.findPlayerDataChartGamesPlayed(dto);
  }

  @Post('countPlayerBannedData')
  countPlayerBannedData(@Body() dto: any) {
    return this.playerReportService.countPlayerBannedData(dto);
  }

  @Post('listDataInPlayerChipsReport')
  listDataInPlayerChipsReport(@Body() dto: any) {
    return this.playerReportService.listDataInPlayerChipsReport(dto);
  }

  // @Post('listTable')
  // listTable(@Body() dto: any) {
  //   return this.playerReportService.listTable(dto);
  // }

  @Post('countDataInPlayerLoyalityPointsReport')
  countDataInPlayerLoyalityPointsReport(@Body() dto: any) {
    return this.loyalityReportService.countDataInPlayerLoyalityPointsReport(
      dto,
    );
  }

  @Post('listDataInPlayerLoyalityPointsReport')
  listDataInPlayerLoyalityPointsReport(@Body() dto: any) {
    return this.loyalityReportService.listDataInPlayerLoyalityPointsReport(dto);
  }

  @Post('countDataInPlayerParentHistory')
  countDataInPlayerParentHistory(@Body() dto: any) {
    return this.playerReportService.countDataInPlayerParentHistory(dto);
  }

  @Post('listDataInPlayerParentHistory')
  listDataInPlayerParentHistory(@Body() dto: any) {
    return this.playerReportService.listDataInPlayerParentHistory(dto);
  }

  @Post('countPlayerBonusInfo')
  countPlayerBonusInfo(@Body() dto: any) {
    return this.playerLockedBonusInfoService.getCountOfPlayerData(dto);
  }

  @Post('countLockedClaimedHistory')
  countLockedClaimedHistory(@Body() dto: any) {
    return this.playerLockedBonusClaimedService.countLockedClaimedHistory(dto);
  }

  @Post('countDataInPlayerHandHistory')
  countDataInPlayerHandHistory(@Body() dto: any) {
    return this.playerHandHistoryService.countDataInPlayerHandHistory(dto);
  }

  @Post('findPlayersReportDateFilter')
  findPlayersReportDateFilter(@Body() dto: any) {
    return this.playerReportService.listPlayersIfDateFilter(dto);
  }

  @Post('listLockedClaimedHistory')
  listLockedClaimedHistory(@Body() dto: any) {
    return this.playerLockedBonusClaimedService.listLockedClaimedHistory(dto);
  }

  @Post('listDataInPlayerHandHistory')
  listDataInPlayerHandHistory(@Body() dto: any) {
    return this.playerHandHistoryService.listDataInPlayerHandHistory(dto);
  }

  @Post('sendHandHistoryToMail')
  sendHandHistoryToMail(@Body() dto: SendHandHistoryToMailDto) {
    return this.playerHandHistoryService.sendHandHistoryToMail(dto);
  }

  @Post('listPlayerLockedBonusInfo')
  listPlayerLockedBonusInfo(@Body() dto: any) {
    return this.playerLockedBonusInfoService.listPlayerLockedBonusData(dto);
  }

  @Post('listPlayerBannedData')
  listPlayerBannedData(@Body() dto: any) {
    return this.playerReportService.listPlayerBannedData(dto);
  }

  @Post('listDataInPlayerBonusReport')
  listDataInPlayerBonusReport(@Body() dto: any) {
    return this.playerReportService.listDataInPlayerBonusReport(dto);
  }

  @Post('countDataInPlayerBonusReport')
  countDataInPlayerBonusReport(@Body() dto: any) {
    return this.playerReportService.countDataInPlayerBonusReport(dto);
  }

  @Post('countDataInPlayerInfoReport')
  countDataInPlayerInfoReport(@Body() dto: any) {
    return this.playerReportService.countDataInPlayerInfoReport(dto);
  }

  @Post('listDataInPlayerInfoReport')
  listDataInPlayerInfoReport(@Body() dto: any) {
    return this.playerReportService.listDataInPlayerInfoReport(dto);
  }
}
