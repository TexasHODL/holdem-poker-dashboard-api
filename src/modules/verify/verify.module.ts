import { forwardRef, Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { DB, DBModel } from '@/database/connections/db';
import { AdminDBModel } from '@/database/connections/admin-db';
import { SharedModule } from '@/shared/shared.module';
import { ScheduledExpiryService } from '../bonus-chips/services/scheduled-expiry/scheduled-expiry.service';

@Module({
  imports: [
    SharedModule,
    DB.pokerDbModels([
      DBModel.User,
      DBModel.PendingPasswordReset
    ]),
    DB.adminDbModels([
      AdminDBModel.BonusCollection,
      AdminDBModel.Affiliates
    ]),
  ],
  controllers: [VerifyController],
  providers: [VerifyService],
  exports: [VerifyService],
})
export class VerifyModule {}
