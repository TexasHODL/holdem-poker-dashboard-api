import { PartialType } from '@nestjs/swagger';
import { CreateLoyalityPlayerDto } from './create-loyality-player.dto';

export class UpdateLoyalityPlayerDto extends PartialType(
  CreateLoyalityPlayerDto,
) {}
