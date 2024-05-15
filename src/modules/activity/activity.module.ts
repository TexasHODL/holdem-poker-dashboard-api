import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { DB } from '@/database/connections/db';
import { AdminDBModel } from '@/database/connections/admin-db';
import { FinanceDbModel, LogDBModel } from '@/database/connections/constants';

@Module({
  imports: [
    DB.financeDbModels([FinanceDbModel.Fundrake]),
    DB.logDbModels([LogDBModel.PlayerLoginData]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
