import { PartialType } from '@nestjs/swagger';
import { CreateLeaderboardSetDto } from './create-leaderboard-set.dto';

export class UpdateLeaderboardSetDto extends PartialType(
  CreateLeaderboardSetDto,
) {}
