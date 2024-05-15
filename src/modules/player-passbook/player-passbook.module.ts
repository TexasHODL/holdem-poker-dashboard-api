import { Module } from '@nestjs/common';
import { PlayerPassbookService } from './player-passbook.service';
import { PlayerPassbookController } from './player-passbook.controller';
import { AdminDBModel } from '@/database/connections/admin-db';
import { DB } from '@/database/connections/db';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DB.adminDbModels([AdminDBModel.Passbook]),
    UserModule,
  ],
  controllers: [PlayerPassbookController],
  providers: [PlayerPassbookService],
  exports: [PlayerPassbookService],
})
export class PlayerPassbookModule { }
