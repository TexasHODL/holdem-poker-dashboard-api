import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountInstantBonusHistoryDto } from '../dto/count-instant-bonus-history.dto';
import { InstantBonusHistoryQueryDto } from '../dto/instant-bonus-history-query.dto';
import { TransferHistoryService } from '../services/transfer-history/transfer-history.service';
@ApiTags('Bonus chips management')
@Controller('')
export class TransferHistoryController {
  constructor(
    @Inject(TransferHistoryService)
    private readonly transferHistoryService: TransferHistoryService,
  ) {}
  // https://pokerdashboard.pokermoogley.com:3838/countInstantBonusHistory
  @Post('countInstantBonusHistory')
  async countInstantBonusHistory(@Body() params: CountInstantBonusHistoryDto) {
    return this.transferHistoryService.countInstantBonusHistory(params);
  }

  // https://pokerdashboard.pokermoogley.com:3838/listInstantBonusHistory
  @Post('listInstantBonusHistory')
  async listInstantBonusHistory(@Body() params: InstantBonusHistoryQueryDto) {
    await this.transferHistoryService.listInstantBonusHistory(params);
    return params;
  }
}
