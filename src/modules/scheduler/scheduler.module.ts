import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { TableModule } from '@/modules/table/table.module';
import { DB, DBModel } from '@/database/connections/db';

@Module({
  imports: [
    DB.pokerDbModels([DBModel.Table]),
    TableModule
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}