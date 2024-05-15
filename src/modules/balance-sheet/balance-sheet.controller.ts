import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BalanceSheetManagementService } from './balance-sheet.service';
import { CreateBalanceSheetDto } from './dto/create-balance-sheet.dto';
import { GetCurrentDataOfBalanceSheetForDashboardDto } from './dto/getCurrentDataOfBalanceSheetForDashboard.dto';
import { UpdateBalanceSheetDto } from './dto/update-balance-sheet.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('')
export class BalanceSheetController {
  constructor(
    private readonly balanceSheetMangementService: BalanceSheetManagementService,
  ) {}

  @Post('findBalanceSheet')
  create(@Body() body: CreateBalanceSheetDto) {
    return this.balanceSheetMangementService.findDetails(body);
  }

  @Post('getCurrentDataOfBalanceSheetForDashboard')
  getCurrentDataOfBalanceSheetForDashboard(
    @Body() dto: GetCurrentDataOfBalanceSheetForDashboardDto,
  ) {
    return this.balanceSheetMangementService.getCurrentDataOfBalanceSheetForDashboard(
      dto,
    );
  }

  @Get('account')
  account () {
    return this.balanceSheetMangementService.getAccount()
  }
}
