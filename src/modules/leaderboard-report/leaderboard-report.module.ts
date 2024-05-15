import { Module } from '@nestjs/common';
import { LeaderboardReportService } from './leaderboard-report.service';
import { LeaderboardReportController } from './leaderboard-report.controller';
import { AdminDBModel, PokerDBModel } from '@/database/connections/constants';
import { DB } from '@/database/connections/db';
import { SharedModule } from '@/shared/shared.module';

@Module({
  controllers: [LeaderboardReportController],
  providers: [LeaderboardReportService],
  imports:[
    SharedModule,
    DB.adminDbModels([
      // AdminDBModel.BonusCollection,
    ]),
    DB.pokerDbModels([
      PokerDBModel.LeaderboardWinners
    ])
  ]
})
export class LeaderboardReportModule {}
