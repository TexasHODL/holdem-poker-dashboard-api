import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdatePlayerDto } from './dto/updatePlayerDto';
import { PlayerService } from './services/player/player.service';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  @Post('updatePlayer')
  updatePlayer(@Body() dto: UpdatePlayerDto) {
    return this.playerService.updatePlayer(dto);
  }
  @Post('countlistPlayer')
  countlistPlayer(@Body() dto: any) {
    return this.playerService.countlistPlayer(dto);
  }
  @Post('createPlayer')
  createPlayer(@Body() dto: any) {
    return this.playerService.createPlayer(dto);
  }
  @Post('listPlayers')
  listPlayers(@Body() dto: any) {
    return this.playerService.listPlayers(dto);
  }
}
