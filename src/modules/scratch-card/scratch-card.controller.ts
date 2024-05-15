import { approveScratchCard, createScratchCardAffiliate, createScratchCardHighRollers, getScratchCardHistory, getScratchCardHistoryCount, getScratchCardList, getScratchCardListCount, rejectScratchCard } from '@/v1/controller/scratchCard/scratchCardController';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ScratchCardService } from './scratch-card.service';

@ApiTags('Scratch Card Management')
@ApiBearerAuth()
@Controller('')
export class ScratchCardController {
  constructor(private readonly scratchCardService: ScratchCardService) { }

  @Post('getScratchCardHistoryCount')
  async getScratchCardHistoryCount(@Req() req, @Body() dto: any) {
    return getScratchCardHistoryCount(req);
  }

  @Post('getScratchCardHistory')
  async getScratchCardHistory(@Req() req, @Body() dto: any) {
    return getScratchCardHistory(req);
  }
  
  @Post('getScratchCardListCount')
  async getScratchCardListCount(@Req() req, @Body() dto: any) {
    return getScratchCardListCount(req);
  }

  @Post('getScratchCardList')
  async getScratchCardList(@Req() req, @Body() dto: any) {
    return getScratchCardList(req);
  }

  @Post('createScratchCardHighRollers')
  async createScratchCardHighRollers(@Req() req, @Body() dto: any) {
    return createScratchCardHighRollers(req);
  }

  @Post('approveScratchCard')
  async approveScratchCard(@Req() req, @Body() dto: any) {
    return approveScratchCard(req);
  }

  @Post('rejectScratchCard')
  async rejectScratchCard(@Req() req, @Body() dto: any) {
    return rejectScratchCard(req);
  }

  @Post('createScratchCardAffiliate')
  async createScratchCardAffiliate(@Req() req, @Body() dto: any) {
    return createScratchCardAffiliate(req);
  }
}
