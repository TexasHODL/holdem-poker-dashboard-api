import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { LoyaltyPointService } from './loyalty-point.service';
import { createLoyaltyPoints, listLoyaltyPoints, updateLoyaltyPoints } from '@/v1/controller/loyaltyPoints/loyaltyPointsController';

@Controller('')
export class LoyaltyPointController {
  constructor(private readonly loyaltyPointService: LoyaltyPointService) {}

  @Post('createLoyaltyPoints')
  createLoyaltyPoints(@Req() req, @Body() dto: any) {
    return createLoyaltyPoints(req);
  }

  @Post('listLoyaltyPoints')
  listLoyaltyPoints(@Req() req, @Body() dto: any) {
    return listLoyaltyPoints(req);
  }

  @Post('updateLoyaltyPoints')
  updateLoyaltyPoints (@Req() req, @Body() dto: any) {
    return updateLoyaltyPoints(req);
  }
}
