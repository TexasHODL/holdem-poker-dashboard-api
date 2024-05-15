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
import { DirectCashoutService } from './direct-cashout.service';
import { CreateDirectCashoutDto } from './dto/create-direct-cashout.dto';
import { UpdateDirectCashoutDto } from './dto/update-direct-cashout.dto';

@ApiBearerAuth()
@Controller('')
export class DirectCashoutController {
  constructor(private readonly directCashoutService: DirectCashoutService) {}

  @Post('findDataForCashoutHistory')
  findDataForCashoutHistory(@Body() body: any) {
    return this.directCashoutService.findDataForCashoutHistory(body);
  }

  @Post('countDataForCashoutHistory')
  countDataForCashoutHistory(@Body() body: any) {
    return this.directCashoutService.countDataForCashoutHistory(body);
  }

  @Post('countDataForCashout')
  countDataForCashout(@Body() body: any) {
    return this.directCashoutService.countDataForCashout(body);
  }

  @Post('findDataForCashout')
  findDataForCashout(@Body() body: any) {
    return this.directCashoutService.findDataForCashout(body);
  }

  // @Get()
  // findAll() {
  //   return this.directCashoutService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.directCashoutService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDirectCashoutDto: UpdateDirectCashoutDto) {
  //   return this.directCashoutService.update(+id, updateDirectCashoutDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.directCashoutService.remove(+id);
  // }
}
