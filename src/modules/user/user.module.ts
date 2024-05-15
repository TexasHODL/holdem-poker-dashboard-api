import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DB, DBModel } from '@/database/connections/db';
import { AffiliateService } from './services/affiliate/affiliate.service';
import { AdminDBModel } from '@/database/connections/admin-db';
import { ModuleAdminService } from './services/module-admin/module-admin.service';
import { ModuleAffiliateService } from './services/module-affiliate/module-affiliate.service';
import { AffiliateController } from './affiliate.controller';
import { PlayerService } from './services/player/player.service';
import { PlayerController } from './player.controller';
import { PlayerBlockedRecordService } from './services/player-blocked-record/player-blocked-record.service';
import { PlayerParentHistoryService } from './services/player-parent-history/player-parent-history.service';
import { FinanceModule } from '../finance/finance.module';
import { LogDBModel } from '@/database/connections/constants';
import { PlayerArchiveService } from './services/player-archive/player-archive.service';
import { PlayerLockedBonusInfoService } from './services/player-locked-bonus-info/player-locked-bonus-info.service';
import { PlayerLockedBonusClaimedService } from './services/player-locked-bonus-claimed/player-locked-bonus-claimed.service';
import { PlayerHandHistoryService } from './services/player-hand-history/player-hand-history.service';
import { SharedModule } from '@/shared/shared.module';
import { ScheduledExpiryService } from '../bonus-chips/services/scheduled-expiry/scheduled-expiry.service';
// import { BonusChipsModule } from '../bonus-chips/bonus-chips.module';
import { VipReleaseService } from './services/vip-release/vip-release.service';
import { InorganicPlayerService } from './services/inorganic-player/inorganic-player.service';
import { FriendService } from './services/friend/friend.service';
import { CashoutModule } from '../cashout/cashout.module';
import { DirectCashoutModule } from '../direct-cashout/direct-cashout.module';
import { PlayerPassbookModule } from '../player-passbook/player-passbook.module';

@Module({
  imports: [
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
    ]),
    DB.logDbModels([
      LogDBModel.PlayerBlockedRecord,
      LogDBModel.PlayerArchive,
      LogDBModel.HandHistory,
    ]),
    // forwardRef(() => PlayerPassbookModule)
  ],
  controllers: [UserController, AffiliateController, PlayerController],
  providers: [
    UserService,
    AffiliateService,
    ModuleAdminService,
    ModuleAffiliateService,
    PlayerBlockedRecordService,
    PlayerParentHistoryService,
    PlayerService,
    PlayerArchiveService,
    PlayerLockedBonusInfoService,
    PlayerLockedBonusClaimedService,
    PlayerHandHistoryService,
    ScheduledExpiryService,
    VipReleaseService,
    InorganicPlayerService,
    FriendService,
  ],
  exports: [
    UserService,
    AffiliateService,
    ModuleAdminService,
    ModuleAffiliateService,
    PlayerBlockedRecordService,
    PlayerParentHistoryService,
    PlayerService,
    PlayerArchiveService,
    PlayerLockedBonusInfoService,
    PlayerLockedBonusClaimedService,
    PlayerHandHistoryService,
    VipReleaseService,
    InorganicPlayerService,
    FriendService,
  ],
})
export class UserModule {}
