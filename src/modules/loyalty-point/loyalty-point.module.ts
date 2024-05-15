import { Module } from '@nestjs/common';
import { LoyaltyPointService } from './loyalty-point.service';
import { LoyaltyPointController } from './loyalty-point.controller';
import { AdminDBModel } from '@/database/connections/admin-db';
import { DB } from '@/database/connections/db';

@Module({
  imports: [DB.adminDbModels([AdminDBModel.LoyaltyPoint])],
  controllers: [LoyaltyPointController],
  providers: [LoyaltyPointService],
  exports: [LoyaltyPointService],
})
export class LoyaltyPointModule {}
