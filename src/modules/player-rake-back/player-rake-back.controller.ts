import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlayerRakeBackService } from './service/player-rake-back.service';
import { PlayerRakeBackDto } from './dto/player-rake-back.dto';
import { UpdatePlayerRakeBackDto } from './dto/update-player-rake-back.dto';
import { CountDataForRakeBackDto } from './dto/count-data-for-rake-back.dto';
import { CountRakebackData } from './dto/count-rake-back-data.dto';
import { ListRakebackData } from './dto/list-rake-back-data.dto';
import { ListRakebackCommissionData } from "./dto/list-rake-back-commission.dto";
import { CountRakebackCommissionData } from "./dto/count-rake-back-commission.dto";
import { ListRakebackHistoryData } from './dto/list-rake-history.dto';
import { CountRakebackHistoryData } from './dto/count-rake-history.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payler Rake Back')
@Controller('')
export class PlayerRakeBackController {
  constructor(private readonly playerRakeBackService: PlayerRakeBackService) {}

  @Post('playerRakeBackReport')
  playerRakeBack(@Body() playerRakeBackDto: PlayerRakeBackDto) {
    return this.playerRakeBackService.playerRakeBackReport(playerRakeBackDto);
  }

  @Post('countDataForRakeBack')
  countDataForRakeBack(
    @Body() countDataForRakeBackDto: CountDataForRakeBackDto,
  ) {
    return this.playerRakeBackService.countDataForRakeBack(
      countDataForRakeBackDto,
    );
  }

  @Post('countRakebackData')
  async countRakebackData(@Body() countRakebackData: CountRakebackData) {
    const count = await this.playerRakeBackService.countRakebackData(
      countRakebackData,
    );
    return count;
  }

  @Post('listRakebackData')
  async listRakebackData(@Body() listRakebackData: ListRakebackData) {
    const rakebackData = await this.playerRakeBackService.listRakebackData(
      listRakebackData,
    );
    return rakebackData;
  }

  @Post('listRakeDataForRakeReportSearch')
  async listRakeDataForRakeReportSearch (@Body() listRakebackCommissionData: ListRakebackCommissionData) {
    const rakebackCommissionData = await this.playerRakeBackService.listRakeDataForRakeReportSearch(
      listRakebackCommissionData
    );

    return rakebackCommissionData;
  }

  @Post('totalRakeDataForRakeReportSearch')
  async totalRakeDataForRakeReportSearch (@Body() listRakebackCommissionData: ListRakebackCommissionData) {
    const totalRakebackCommissionData = await this.playerRakeBackService.totalRakeDataForRakeReportSearch(
      listRakebackCommissionData
    );

    return totalRakebackCommissionData;
  }

  @Post('countRakeDataReportDataSearch')
  async countRakeDataReportDataSearch (@Body() countRakebackCommissionData: CountRakebackCommissionData) {
    const count = await this.playerRakeBackService.countRakeDataReportDataSearch(
      countRakebackCommissionData
    );

    return count;
  }

  @Post('listRakeDataRakeHistory')
  async listRakeDataRakeHistory (@Body() listRakebackHistoryData: ListRakebackHistoryData) {
    const rakeHistory = await this.playerRakeBackService.listRakeDataRakeHistory(
      listRakebackHistoryData
    );

    return rakeHistory;
  }

  @Post('countRakeDataRakeHistory')
  async countRakeDataRakeHistory (@Body() listRakebackHistoryData: ListRakebackHistoryData) {
    const rakeHistory = await this.playerRakeBackService.countRakeDataRakeHistory(
      listRakebackHistoryData
    );

    return rakeHistory;
  }

  @Post('countRakePLayerReportDataSearch')
  async countRakePLayerReportDataSearch (@Body() countRakebackCommissionData: CountRakebackCommissionData) {
    const count = await this.playerRakeBackService.countRakePlayerDataReportDataSearch(
      countRakebackCommissionData
    );

    return count;
  }

  @Post('currentCycleRakeBack')
  async currentCycleRakeBack (@Body() currentCycleRakeBack: any) {
    const rakeCurrentCycleRakeBack = await this.playerRakeBackService.currentCycleRakeBack(
      currentCycleRakeBack
    );

    return rakeCurrentCycleRakeBack;
  }

  // @Get()
  // findAll() {
  //   return this.playerRakeBackService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.playerRakeBackService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePlayerRakeBackDto: UpdatePlayerRakeBackDto) {
  //   return this.playerRakeBackService.update(+id, updatePlayerRakeBackDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.playerRakeBackService.remove(+id);
  // }
}
