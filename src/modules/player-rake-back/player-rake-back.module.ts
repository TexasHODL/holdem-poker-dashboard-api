import { Module } from '@nestjs/common';
import { PlayerRakeBackService } from './service/player-rake-back.service';
import { PlayerRakeBackController } from './player-rake-back.controller';
import { AdminDBModel, AdminDBModels } from '@/database/connections/admin-db';
import { DB, DBModel } from '@/database/connections/db';
import { UserModule } from '../user/user.module';
import { FinanceDbModel } from '@/database/connections/constants';

@Module({
  imports: [
    UserModule,
    DB.adminDbModels([AdminDBModel.Affiliates, AdminDBModel.RakeReport, AdminDBModel.RakebackPlayerHistory, AdminDBModel.RakebackHistory]),
    DB.financeDbModels([
      FinanceDbModel.Fundrake,
      FinanceDbModel.PlayerRakeBack,
    ]),
    DB.pokerDbModels([DBModel.User]),
  ],
  controllers: [PlayerRakeBackController],
  providers: [PlayerRakeBackService],
  exports: [PlayerRakeBackService],
})
export class PlayerRakeBackModule {}
