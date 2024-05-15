import { Module } from '@nestjs/common';
import { PalyerBankDetailsService } from './palyer-bank-details.service';
import { PalyerBankDetailsController } from './palyer-bank-details.controller';
import { DB, DBModel } from '@/database/connections/db';
import { SharedModule } from '@/shared/shared.module';

@Module({
  controllers: [PalyerBankDetailsController],
  providers: [PalyerBankDetailsService],
  exports:[PalyerBankDetailsService],
  imports:[
    SharedModule,
    DB.pokerDbModels([
      DBModel.PalyerBankDetails,
    ]),
    DB.adminDbModels([

    ]),
    DB.logDbModels([

    ]),
  ]
})
export class PalyerBankDetailsModule {}
