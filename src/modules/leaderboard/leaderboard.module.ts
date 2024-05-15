import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { AdminDBModel, PokerDBModel } from '@/database/connections/constants';
import { DB } from '@/database/connections/db';
import { SharedModule } from '@/shared/shared.module';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  imports:[
    SharedModule,
    DB.adminDbModels([
      AdminDBModel.BonusCollection,
    ]),
    DB.pokerDbModels([
      PokerDBModel.LeaderboardParticipant
    ])
  ]
})
export class LeaderboardModule {}
