import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoyalityPlayerService } from './loyality-player.service';
import { CreateLoyalityPlayerDto } from './dto/create-loyality-player.dto';
import { UpdateLoyalityPlayerDto } from './dto/update-loyality-player.dto';

@Controller('loyality-player')
export class LoyalityPlayerController {
  constructor(private readonly loyalityPlayerService: LoyalityPlayerService) {}

  // @Post()
  // create(@Body() createLoyalityPlayerDto: CreateLoyalityPlayerDto) {
  //   return this.loyalityPlayerService.create(createLoyalityPlayerDto);
  // }

  // @Get()
  // findAll() {
  //   return this.loyalityPlayerService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.loyalityPlayerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLoyalityPlayerDto: UpdateLoyalityPlayerDto) {
  //   return this.loyalityPlayerService.update(+id, updateLoyalityPlayerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.loyalityPlayerService.remove(+id);
  // }
}
