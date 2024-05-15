import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlayerBuildAccessDto } from './dto/player-build-access.dto';
import { UpdatePlayerBuildAcessDto } from './dto/update-player-build-access.dto';
import { PlayerBuildAccessService } from './player-build-access.service';

@ApiTags('Player Build Access')
@Controller('')
export class PlayerBuildAccessController {
  constructor(
    private readonly playerBuildAccessService: PlayerBuildAccessService,
  ) {}

  @Post('listPlayerForBuildAcess')
  listPlayerForBuildAcess(@Body() playerBuildAccessDto: PlayerBuildAccessDto) {
    return this.playerBuildAccessService.listPlayerDetails(
      playerBuildAccessDto,
    );
  }

  @Post('updatePlayerBuildAcess')
  updatePlayerBuildAcess(
    @Body() updatePlayerBuildAcessDto: UpdatePlayerBuildAcessDto,
  ) {
    return this.playerBuildAccessService.updatePlayerBuildAccess(
      updatePlayerBuildAcessDto,
    );
  }
}
