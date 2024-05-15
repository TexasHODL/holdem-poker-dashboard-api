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
import { CashoutService } from './cashout.service';
import { CreateCashoutDto } from './dto/create-cashout.dto';
import { UpdateCashoutDto } from './dto/update-cashout.dto';
import { ApproveCashoutRequestService } from './services/approve-cashout-request/approve-cashout-request.service';
import { PendingCashoutRequestService } from './services/pending-cashout-request/pending-cashout-request.service';

@ApiTags('Cashout Dashboard')
@Controller('')
@ApiBearerAuth()
export class CashoutController {
  constructor(
    private readonly cashoutService: CashoutService,
    private readonly approveCashoutRequestService: ApproveCashoutRequestService,
    private readonly pendingCashoutRequestService: PendingCashoutRequestService,
  ) {}

  @Post('getCashOutRequestCount')
  getCashOutRequestCount(@Body() body: any) {
    return this.pendingCashoutRequestService.getCashOutRequestCount(body);
  }

  @Post('listPendingCashOutRequest')
  listPendingCashOutRequest(@Body() body: any) {
    return this.pendingCashoutRequestService.listPendingCashOutRequest(body);
  }

  @Post('approveCashoutCount')
  approveCashoutCount(@Body() body: any) {
    return this.approveCashoutRequestService.approveCashoutCount(body);
  }

  @Post('listApproveCashOutRequest')
  listApproveCashOutRequest(@Body() body: any) {
    return this.approveCashoutRequestService.listApproveCashOutRequest(body);
  }

  @Post('getRequestPayment')
  getRequestPayment (@Body() body: any) {
    return this.approveCashoutRequestService.getRequestPayment(body);
  }

  @Post('paymentInvoiceCashout')
  paymentInvoiceCashout (@Body() body: any) {
    return this.approveCashoutRequestService.paymentInvoiceCashout(body);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCashoutDto: UpdateCashoutDto) {
  //   return this.cashoutService.update(+id, updateCashoutDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cashoutService.remove(+id);
  // }
}
