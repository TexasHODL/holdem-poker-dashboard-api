import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CashoutAffiliateService } from './cashout-affiliate.service';
import { CreateCashoutAffiliateDto } from './dto/create-cashout-affiliate.dto';
import { UpdateCashoutAffiliateDto } from './dto/update-cashout-affiliate.dto';

@ApiTags('Cashout Dashboard')
@Controller('')
@ApiBearerAuth()
export class CashoutAffiliateController {
  constructor(private readonly cashoutAffiliateService: CashoutAffiliateService) {}

  @Post('insertIntoCashoutHistory/onTransfer')
  insertIntoCashoutHistoryOnTransfer(@Body() body: any) {
    return this.cashoutAffiliateService.insertIntoCashoutHistoryOnTransfer(body);
  }
  @Post('processApproveCashout')
  processApproveCashout(@Body() body: any) {
    return this.cashoutAffiliateService.processApproveCashout(body);
  }

  @Post('removeCashoutRequestOnAction')
  removeCashoutRequestOnAction(@Body() body: any) {
    return this.cashoutAffiliateService.removeCashoutRequestOnAction(body);
  }

  @Post('removeFromCashsoutApprovel')
  removeFromCashsoutApprovel(@Body() body: any) {
    return this.cashoutAffiliateService.removeFromCashsoutApprovel(body);
  }

  @Post('getCashoutHistoryCount')
  getCashoutHistoryCount(@Body() body: any) {
    return this.cashoutAffiliateService.getCashoutHistoryCount(body);
  }

  @Post('listCashOutHistory')
  listCashOutHistory(@Body() body: any) {
    return this.cashoutAffiliateService.listCashOutHistory(body);
  }

  @Post('insertIntoCashoutHistory')
  insertIntoCashoutHistory (@Body() body: any) {
    return this.cashoutAffiliateService.insertIntoCashoutHistory(body);
  }

  @Post('createAffilateWithDrawlRequest')
  createAffilateWithDrawlRequest (@Body() body: any) {
    return this.cashoutAffiliateService.createAffilateWithDrawlRequest(body);
  }

  @Post('approveDataForCashout')
  approveDataForCashout (@Body() body: any) {
    return this.cashoutAffiliateService.approveDataForCashout(body);
  }

  @Post('rejectDataForCashout')
  rejectDataForCashout (@Body() body: any) {
    return this.cashoutAffiliateService.rejectDataForCashout(body);
  }

  @Post('createAffilateWithDrawlRequestWithInvoiceId')
  createAffilateWithDrawlRequestWithInvoiceId (@Body() body: any) {
    return this.cashoutAffiliateService.createAffilateWithDrawlRequestWithInvoiceId(body);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cashoutAffiliateService.remove(+id);
  // }
}
