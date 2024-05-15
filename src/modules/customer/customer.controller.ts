import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
@ApiTags("Customer")
@ApiBearerAuth()
@Controller("")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post("personalDetailsPlayer")
  personalDetailsPlayer(@Body() dto: any) {
    return this.customerService.findPlayerPersonalDetails(dto);
  }
  @Post("transactionHistoryCustomerSupport")
  transactionHistoryCustomerSupport(@Body() dto: any) {
    return this.customerService.transactionHistoryCustomerSupport(dto);
  }
  @Post("playerMagnetChipsDetails")
  playerMagnetChipsData(@Body() dto: any) {
    return this.customerService.playerMagnetChipsData(dto);
  }
  @Post("countPlayerGameHistory")
  countPlayerGameHistory(@Body() dto: any) {
    return this.customerService.countPlayerGameHistory(dto);
  }
  @Post("listPlayerGameHistory")
  listPlayerGameHistory(@Body() dto: any) {
    return this.customerService.listPlayerGameHistory(dto);
  }
  @Post("listAllCashTable")
  getAllCashTablesProcess(@Body() dto: any) {
    return this.customerService.getAllCashTablesProcess(dto);
  }
}
