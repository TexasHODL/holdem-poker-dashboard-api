import { Module } from '@nestjs/common';
import { PlayerReportService } from './player-report.service';
import { PlayerReportController } from './player-report.controller';
import { UserModule } from '../user/user.module';
import { FinanceModule } from '../finance/finance.module';
import { DirectCashoutModule } from '../direct-cashout/direct-cashout.module';
import { BonusChipsModule } from '../bonus-chips/bonus-chips.module';
import { LoyalityReportService } from './services/loyality-report/loyality-report.service';
import { LoyalityPlayerModule } from '../loyality-player/loyality-player.module';

@Module({
  imports: [
    UserModule,
    FinanceModule,
    DirectCashoutModule,
    BonusChipsModule,
    LoyalityPlayerModule,
  ],
  controllers: [PlayerReportController],
  providers: [PlayerReportService, LoyalityReportService],
})
export class PlayerReportModule {}
