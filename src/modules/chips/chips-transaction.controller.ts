import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { GetcurrentbalDto } from './dto/getcurrentbalDto';
import { ChipsTransactionService } from './services/chips-transaction/chips-transaction.service';

@ApiTags('Chips Management')
@ApiBearerAuth()
@Controller('')
export class ChipsTransactionController {
  constructor(
    private readonly auth: AuthService,
    private readonly chipsTransactionService: ChipsTransactionService,
  ) {}
  @Post('getuserolelist')
  getuserolelist(@Body() dto: GetcurrentbalDto) {
    return this.chipsTransactionService.getUseroleList({
      ...dto,
      loggedinUserid: this.auth.getCurrentUserId(),
    });
  }

  @Post('getcurrentbal')
  getcurrentbal(@Body() dto: any) {
    return this.chipsTransactionService.getcurrentbal(dto);
  }

  @Post('getWithdrawlProfile')
  getWithdrawlProfile(@Body() dto: any) {
    return this.chipsTransactionService.getWithdrawlProfile(dto);
  }
}
