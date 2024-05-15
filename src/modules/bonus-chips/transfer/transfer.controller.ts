import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InstantBonusHistoryDto } from '../dto/instant-bonus-history.dto';
import { ListUsersAndCalculateBonusDto } from '../dto/list-users-and-calculate-bonus.dto';
import { TransferService } from '../services/transfer/transfer.service';

@ApiTags('Bonus chips management')
@Controller('')
export class TransferController {
  constructor(
    @Inject(TransferService)
    private readonly transferService: TransferService,
  ) {}

  @Post('listUsersAndCalculateBonus')
  async listUsersAndCalculateBonus(
    @Req() req,
    @Body() body: ListUsersAndCalculateBonusDto,
  ) {
    return this.transferService.listPlayersAndAssignBonus(body);
  }

  // https://pokerdashboard.pokermoogley.com:3838/instantBonusTransfer
  @Post('instantBonusTransfer')
  async instantBonusTransfer(@Req() req, @Body() body: InstantBonusHistoryDto) {
    return this.transferService.instantBonusTransfer(body);
  }
}
