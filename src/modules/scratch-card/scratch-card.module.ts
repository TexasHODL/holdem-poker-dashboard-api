import { Module } from '@nestjs/common';
import { ScratchCardService } from './scratch-card.service';
import { ScratchCardController } from './scratch-card.controller';
import { AdminDBModel, LogDBModel } from '@/database/connections/constants';
import { DB, DBModel } from '@/database/connections/db';
import { SharedModule } from '@/shared/shared.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  controllers: [ScratchCardController],
  providers: [ScratchCardService],
  imports:[
    SharedModule,
    FinanceModule,
    DB.pokerDbModels([
      DBModel.User,
      DBModel.ScheduledExpiry,
      DBModel.VipRelease,
      DBModel.BonusData,
      DBModel.Friend,
    ]),
    DB.adminDbModels([
      AdminDBModel.Affiliates,
      AdminDBModel.ModuleAdmin,
      AdminDBModel.ModuleAffiliate,
      AdminDBModel.PlayerParentHistory,
      AdminDBModel.ScratchCardHistory,
      AdminDBModel.ScratchCardPending,
    ]),
    DB.logDbModels([
      LogDBModel.PlayerBlockedRecord,
      LogDBModel.PlayerArchive,
      LogDBModel.HandHistory,
    ]),
  ]
})
export class ScratchCardModule {}
