import { PartialType } from '@nestjs/swagger';
import { PlayerRakeBackDto } from './player-rake-back.dto';

export class UpdatePlayerRakeBackDto extends PartialType(PlayerRakeBackDto) {}
