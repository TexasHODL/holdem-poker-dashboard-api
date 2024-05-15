import { PartialType } from '@nestjs/swagger';
import { CreatePlayerPassbookDto } from './create-player-passbook.dto';

export class UpdatePlayerPassbookDto extends PartialType(
  CreatePlayerPassbookDto,
) {}
