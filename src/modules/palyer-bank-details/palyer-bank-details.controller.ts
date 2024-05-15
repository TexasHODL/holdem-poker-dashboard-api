import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PalyerBankDetailsService } from './palyer-bank-details.service';
import { CreatePalyerBankDetailDto } from './dto/create-palyer-bank-detail.dto';
import { UpdatePalyerBankDetailDto } from './dto/update-palyer-bank-detail.dto';

@Controller('palyer-bank-details')
export class PalyerBankDetailsController {
  constructor(private readonly palyerBankDetailsService: PalyerBankDetailsService) {}

  // @Post()
  // create(@Body() createPalyerBankDetailDto: CreatePalyerBankDetailDto) {
  //   return this.palyerBankDetailsService.create(createPalyerBankDetailDto);
  // }

  // @Get()
  // findAll() {
  //   return this.palyerBankDetailsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.palyerBankDetailsService.findOne(+id);
  // }


}
