import { NestFactory } from '@nestjs/core';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { useSwagger } from './swagger';
import { json, urlencoded, raw, text } from 'body-parser';
import { useLogger } from './logger';
import { useView } from './view';
import { AuthModule } from './modules/auth/auth.module';
import { BonusChipsModule } from './modules/bonus-chips/bonus-chips.module';
import { PlayerRakeBackModule } from './modules/player-rake-back/player-rake-back.module';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { ActivityModule } from './modules/activity/activity.module';
import { useApp } from './app';
import { TransactionHistoryModule } from './modules/transaction-history/transaction-history.module';
import { ChipsModule } from './modules/chips/chips.module';
import { PlayerBuildAccessModule } from './modules/player-build-access/player-build-access.module';
import { UserModule } from './modules/user/user.module';
import { PlayerReportModule } from './modules/player-report/player-report.module';
import { SpamWordModule } from './modules/spam-word/spam-word.module';
import { LeaderboardSetModule } from './modules/leaderboard-set/leaderboard-set.module';
import { BalanceSheetModule } from './modules/balance-sheet/balance-sheet.module';
import { ChipsReportModule } from './modules/chips-report/chips-report.module';
import { CustomerModule } from './modules/customer/customer.module';
import https from "https";
import fs from "fs";
import express from "express";
async function bootstrap() {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));

  if (process.env.ENABLE_SWAGGER) {
    useSwagger(app, [
      AuthModule,
      UserModule,
      BonusChipsModule,
      PlayerRakeBackModule,
      TransactionHistoryModule,
      ActivityModule,
      ChipsModule,
      ActivityModule,
      PlayerBuildAccessModule,
      PlayerReportModule,
      SpamWordModule,
      LeaderboardSetModule,
      BalanceSheetModule,
      ChipsReportModule,
      CustomerModule
    ]);
  }

  // enable log
  useLogger(app);

  app.enableCors();

  // body parser
  app.use(json(), express.urlencoded({ extended: true }), raw(), text());

  // View configs
  useView(app);

  app.useGlobalInterceptors(new ResponseInterceptor());

  useApp(app);
  
  // const httpsOptions = {
  //   key: fs.readFileSync('./ssl/poker.key'),
  //   cert: fs.readFileSync('./ssl/poker.crt'),
  // };
  await app.init();
  await app.listen(process.env.PORT || 3000);
  // https.createServer(httpsOptions, server).listen(3838);
}
bootstrap();
