import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get('playerChat/:playerName')
  playerChat(@Req() req, @Body() dto: any) {
    return this.chatService.getPlayerChat(req.params);
  }

  @Post('countChatHistory')
  countChatHistory(@Body() body: any) {
    return this.chatService.countChatHistory(body);
  }
  @Post('listChatHistory')
  listChatHistory(@Body() body: any) {
    return this.chatService.listChatHistory(body);
  }
}
