import { Body, Controller, Post } from '@nestjs/common';
import { BonusClaimService } from './services/bonus-claim/bonus-claim.service';

@Controller('')
export class BonusChipsController {
  constructor(private readonly bonusClaimService: BonusClaimService) {}
  @Post('claimPlayerLockedBonus')
  claimPlayerLockedBonus(@Body() body) {
    return this.bonusClaimService.claimLockedBonusPlayer(body);
  }
}
