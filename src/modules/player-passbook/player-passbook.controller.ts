import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { PlayerPassbookService } from './player-passbook.service';


@Controller('')
export class PlayerPassbookController {
  constructor(private readonly playerPassbookService: PlayerPassbookService) {}


  @Post('countDataForPlayerPassbook')
  countDataForPlayerPassbook(@Body() dto: any) {
    return this.playerPassbookService.countDataForPlayerPassbook(dto);
  }
 
}
