import { addPromotionalBonus, countBonusDeposit, createBonusCode, instantBonusExpire, listBonusDeposit, listPromotionalBonus, removePromotionalBonus, updateBonusCode } from '@/v1/controller/bonusCode/bonusCodeController';
import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { BonusCodeService } from './bonus-code.service';

@Controller('')
export class BonusCodeController {
  constructor(private readonly bonusCodeService: BonusCodeService) {}
  @Post('createBonusCode')
  createBonusCode(@Req() req, @Body() dto: any) {
    return createBonusCode(req);
  }

  @Post('updateBonusCode')
  updateBonusCode(@Req() req, @Body() dto: any) {
    return updateBonusCode(req);
  }

  @Post('countBonusDeposit')
  countBonusDeposit(@Req() req, @Body() dto: any) {
    return countBonusDeposit(req);
  }

  @Post('listBonusDeposit')
  listBonusDeposit(@Req() req, @Body() dto: any) {
    return listBonusDeposit(req);
  }
  @Delete('removePromotionalBonus/:id')
  removePromotionalBonus(@Req() req, @Body() dto: any) {
    return removePromotionalBonus(req);
  }
  @Post('addPromotionalBonus')
  addPromotionalBonus(@Req() req, @Body() dto: any) {
    return addPromotionalBonus(req);
  }

  
  @Get('instantBonusExpire/:id')
  instantBonusExpire(@Req() req, @Body() dto: any) {
    return instantBonusExpire(req);
  }

  @Get('listPromotionalBonus')
  listPromotionalBonus(@Req() req, @Body() dto: any) {
    return listPromotionalBonus(req);
  }
}
