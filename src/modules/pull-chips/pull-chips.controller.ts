import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PullChipsService } from './pull-chips.service';
import { CreatePullChipDto } from './dto/create-pull-chip.dto';
import { UpdatePullChipDto } from './dto/update-pull-chip.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Pull chips management')
@ApiBearerAuth()
@Controller('')
export class PullChipsController {
  constructor(private readonly pullChipsService: PullChipsService) {}

  @Post('searchAffiliate')
  create(@Body() body: any) {
    return this.pullChipsService.searchAffiliate(body);
  }

  @Post('pullChipsAffiliate')
  pullChipsAffiliate(@Body() body: any) {
    return this.pullChipsService.pullChipsAffiliate(body);
  }

  @Post('searchPlayer')
  searchPlayer(@Body() body: any) {
    return this.pullChipsService.searchPlayer(body);
  }

  @Post('checkUserWithdrawlTransactionPullChips')
  checkUserWithdrawlTransactionPullChips(@Body() body: any) {
    return this.pullChipsService.checkUserWithdrawlTransactionPullChips(body);
  }

  @Post('pullChipsPlayerByAdmin')
  pullChipsPlayerByAdmin (@Body() body: any) {
    return this.pullChipsService.pullChipsPlayerByAdmin(body);
  }

  @Post('checkUserInstantChipsToPull')
  checkUserInstantChipsToPull(@Body() body: any) {
    return this.pullChipsService.checkUserInstantChipsToPull(body);
  }

  @Post('pullInstantChipsPlayerByAdmin') 
  pullInstantChipsPlayerByAdmin (@Body() body: any) {
    return this.pullChipsService.pullInstantChipsPlayerByAdmin(body);
  }

  @Post('countInstantChipsPulledHistory')
  countInstantChipsPulledHistory(@Body() body: any) {
    return this.pullChipsService.countInstantChipsPulledHistory(body);
  }

  @Post('listInstantChipsPulledHistory')
  listInstantChipsPulledHistory(@Body() body: any) {
    return this.pullChipsService.listInstantChipsPulledHistory(body);
  }

  @Post('searchPlayerAff')
  searchPlayerAff(@Body() body: any) {
    return this.pullChipsService.searchPlayerAff(body);
  }
  
  @Post('pullChipsPlayerByAff')
  pullChipsPlayerByAff(@Body() body: any) {
    return this.pullChipsService.pullChipsPlayerByAff(body);
  }
}
