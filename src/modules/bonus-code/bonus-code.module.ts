import { Module } from '@nestjs/common';
import { BonusCodeService } from './bonus-code.service';
import { BonusCodeController } from './bonus-code.controller';
import { SharedModule } from '@/shared/shared.module';
import { AdminDBModel, PokerDBModel } from '@/database/connections/constants';
import { DB, DBModel } from '@/database/connections/db';

@Module({
  controllers: [BonusCodeController],
  providers: [BonusCodeService],
  imports: [
    SharedModule,
    DB.adminDbModels([
      AdminDBModel.BonusCollection,
      AdminDBModel.PromoBonus
    ]),

  ]
})
export class BonusCodeModule { }
