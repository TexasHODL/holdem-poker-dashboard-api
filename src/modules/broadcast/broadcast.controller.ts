import { Body, Controller, Post, Req } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';

@Controller('')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Post('broadcastToGame')
  async broadcastToGame(@Req() req, @Body() body: any) {
    return this.broadcastService.sendBroadcastToGame(body);
  }
}
