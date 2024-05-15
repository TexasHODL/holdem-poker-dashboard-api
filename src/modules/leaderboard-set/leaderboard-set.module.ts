import { Module } from '@nestjs/common';
import { LeaderboardSetService } from './leaderboard-set.service';
import { LeaderboardSetController } from './leaderboard-set.controller';
import { DB } from '@/database/connections/db';
import { AdminDBModel } from '@/database/connections/constants';

@Module({
  imports: [
    DB.adminDbModels([AdminDBModel.Leaderboard, AdminDBModel.LeaderboardSet]),
  ],
  controllers: [LeaderboardSetController],
  providers: [LeaderboardSetService],
})
export class LeaderboardSetModule {}
