import { ConfigModule } from '@nestjs/config';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ActivityModule } from './modules/activity/activity.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { V1Module } from './v1/v1.module';
import { BonusChipsModule } from './modules/bonus-chips/bonus-chips.module';
import { CoreModule } from './core/core.module';
// import mongoose from 'mongoose';
import { DB } from './database/connections/db';
import { SharedModule } from './shared/shared.module';
import { PlayerPassbookModule } from './modules/player-passbook/player-passbook.module';
import { PlayerRakeBackModule } from './modules/player-rake-back/player-rake-back.module';
import { LoyaltyPointModule } from './modules/loyalty-point/loyalty-point.module';
import { FinanceModule } from './modules/finance/finance.module';
import { TransactionHistoryModule } from './modules/transaction-history/transaction-history.module';
import { ChipsModule } from './modules/chips/chips.module';
import { AuthMiddleware } from './modules/auth/middlewares/auth.middleware';
import { PlayerBuildAccessModule } from './modules/player-build-access/player-build-access.module';
import { PlayerReportModule } from './modules/player-report/player-report.module';
import { DirectCashoutModule } from './modules/direct-cashout/direct-cashout.module';
import { TableModule } from './modules/table/table.module';
import { TournamentModule } from './modules/tournament/tournament.module';
import { LoyalityPlayerModule } from './modules/loyality-player/loyality-player.module';
import { SpamWordModule } from './modules/spam-word/spam-word.module';
import { LeaderboardSetModule } from './modules/leaderboard-set/leaderboard-set.module';
import { BalanceSheetModule } from './modules/balance-sheet/balance-sheet.module';
import { CashoutModule } from './modules/cashout/cashout.module';
import { ChipsReportModule } from './modules/chips-report/chips-report.module';
import { CustomerModule } from './modules/customer/customer.module';
import { PalyerBankDetailsModule } from './modules/palyer-bank-details/palyer-bank-details.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { ScratchCardModule } from './modules/scratch-card/scratch-card.module';
import { RakeAnalyticsModule } from './modules/rake-analytics/rake-analytics.module';
import { LeaderboardReportModule } from './modules/leaderboard-report/leaderboard-report.module';
import { ChatModule } from './modules/chat/chat.module';
import { BroadcastModule } from './modules/broadcast/broadcast.module';
import { BonusCodeModule } from './modules/bonus-code/bonus-code.module';
import { CashoutReportModule } from './modules/cashout-report/cashout-report.module';
import { CashoutAffiliateModule } from './modules/cashout-affiliate/cashout-affiliate.module';
import { PullChipsModule } from './modules/pull-chips/pull-chips.module';
import { RakebackConfigModule } from "./modules/rakeback-config/rakeback-config.module";
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { VerifyModule } from "./modules/verify/verify.module";
// Connect as default for old Module
// require('dotenv').config('../.env');
// mongoose.connect(process.env.MONGO_DB_URI + '/pokerAdminDb');

@Module({
  imports: [
    ConfigModule.forRoot(),
    DB.pokerDb(),
    DB.adminDb(),
    DB.financeDb(),
    DB.logDb(),
    DB.inMemoryDb(),
    CoreModule,
    SharedModule,
    V1Module,
    AuthModule,
    UserModule,
    ActivityModule,
    BonusChipsModule,
    PlayerPassbookModule,
    PlayerRakeBackModule,
    LoyaltyPointModule,
    FinanceModule,
    TransactionHistoryModule,
    ChipsModule,
    PlayerBuildAccessModule,
    PlayerReportModule,
    DirectCashoutModule,
    TableModule,
    TournamentModule,
    LoyalityPlayerModule,
    SpamWordModule,
    LeaderboardSetModule,
    BalanceSheetModule,
    CashoutModule,
    ChipsReportModule,
    CustomerModule,
    PalyerBankDetailsModule,
    LeaderboardModule,
    ScratchCardModule,
    RakeAnalyticsModule,
    LeaderboardReportModule,
    ChatModule,
    BroadcastModule,
    BonusCodeModule,
    CashoutReportModule,
    CashoutAffiliateModule,
    PullChipsModule,
    RakebackConfigModule,
    SchedulerModule,
    VerifyModule,
  ],
  exports: [V1Module, SharedModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'login', method: RequestMethod.ALL },
        { path: 'resendVerificationLinkDasboard', method: RequestMethod.ALL },
        { path: 'resendEmailVerificationLink', method: RequestMethod.ALL },
        { path: 'verifyEmail', method: RequestMethod.ALL },
        { path: 'websiteSendMail', method: RequestMethod.ALL },
        { path: 'resetPasswordPlayer', method: RequestMethod.ALL },
        { path: 'checkTokenResetExpried', method: RequestMethod.ALL },
        { path: 'checkVerifyAuthCode', method: RequestMethod.ALL },
        { path: 'resetPassword', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
