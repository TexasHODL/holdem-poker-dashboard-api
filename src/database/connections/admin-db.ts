import { ConnectionNames } from '@/constants/connections';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  InjectModel,
  ModelDefinition,
  MongooseModule,
  MongooseModuleAsyncOptions,
} from '@nestjs/mongoose';

// Schemas
import { passbookSchema } from '@/v1/model/schema/passbook';
import { loyaltyPointsSchema } from '@/v1/model/schema/loyaltyPoints';

// import { playerRakeBackSchema } from '@/v1/model/schema/playerRakeBack';
import { affiliatesSchema } from '@/v1/model/schema/affiliates';
import { transactionHistorySchema } from '@/v1/model/schema/transactionHistory';
import { chipstransferToPlayerHistorySchema } from '@/v1/model/schema/chipstransferToPlayerHistory';
import { ChipsTransferToAffiliateHistorySchema } from '@/modules/chips/entities/chips-transfer-to-affiliate-history.entity';
import { AdminDBModel } from './constants';
import { moduleAdminSchema } from '@/v1/model/schema/moduleAdmin';
import { moduleAffiliatesSchema } from '@/v1/model/schema/moduleAffiliates';
import { loggedInAffiliatesSchema } from '@/v1/model/schema/loggedInAffiliates';
import { PlayerParentHistorySchema } from '@/modules/user/entities/playerParentHistory.entity';
import { DirectCashoutSchema } from '@/modules/direct-cashout/entities/direct-cashout.entity';
import { DirectCashoutHistorySchema } from '@/modules/direct-cashout/entities/directCashoutHistory.entity';
import { cashoutHistorySchema } from '@/v1/model/schema/cashoutHistory';
import { pendingCashoutRequestSchema } from '@/v1/model/schema/pendingCashoutRequest';
import { approveCashoutSchema } from '@/v1/model/schema/approveCashoutRequest';
import { leaderboardSchema } from '@/v1/model/schema/leaderboard';
import { leaderboardSetSchema } from '@/v1/model/schema/leaderboardSet';
import { getDBUri } from './helpers';
import { scratchCardHistorySchema } from '@/v1/model/schema/scratchCardHistory';
import { bonusCollectionSchema } from '@/v1/model/schema/bonusCollection';
import { scratchCardPendingSchema } from '@/v1/model/schema/scratchCardPending';
import { promoBonusSchema } from '@/v1/model/schema/promoBonus';
import { InstantChipsPulledHistorySchema } from '@/modules/pull-chips/entities/instantChipsPulledHistory.entity';
import { depositSchema } from '@/v1/model/schema/deposit';
import { rakeReportSchema } from "@/v1/model/schema/rakeReport";
import { rakebackPlayerHistorySchema } from "@/v1/model/schema/rakebackPlayerHistory";
import { rakebackConfigurationSchema } from "@/v1/model/schema/rakebackConfiguration";
import { rakebackHistorySchema } from "@/v1/model/schema/rakebackHistory";

// export enum AdminDBModel {
//   Passbook = 'passbook',
//   PlayerRakeBack = 'playerRakeBack',
//   LoyaltyPoint = 'loyaltyPoints',
//   Fundrake = 'fundrake',
//   Affiliates = 'affiliates',
//   TransactionHistory = 'transactionHistory',
//   ChipstransferToPlayerHistory = 'chipstransferToPlayerHistory',
//   ChipsTransferToAffiliateHistory = 'chipsTransferToAffiliateHistory'
// }

export { AdminDBModel };

export const AdminDBModels: ModelDefinition[] = [
  // admin db
  {
    name: AdminDBModel.Passbook,
    schema: passbookSchema,
  },
  {
    name: AdminDBModel.LoyaltyPoint,
    schema: loyaltyPointsSchema,
  },
  {
    name: AdminDBModel.Affiliates,
    schema: affiliatesSchema,
  },
  {
    name: AdminDBModel.TransactionHistory,
    schema: transactionHistorySchema,
  },
  {
    name: AdminDBModel.ChipstransferToPlayerHistory,
    schema: chipstransferToPlayerHistorySchema,
  },
  {
    name: AdminDBModel.ChipsTransferToAffiliateHistory,
    schema: ChipsTransferToAffiliateHistorySchema,
  },
  {
    name: AdminDBModel.ModuleAdmin,
    schema: moduleAdminSchema,
  },
  {
    name: AdminDBModel.ModuleAffiliate,
    schema: moduleAffiliatesSchema,
  },
  {
    name: AdminDBModel.LoggedInAffiliate,
    schema: loggedInAffiliatesSchema,
  },
  {
    name: AdminDBModel.PlayerParentHistory,
    schema: PlayerParentHistorySchema,
  },
  {
    name: AdminDBModel.DirectCashout,
    schema: DirectCashoutSchema,
  },
  {
    name: AdminDBModel.DirectCashoutHistory,
    schema: DirectCashoutHistorySchema,
  },
  {
    name: AdminDBModel.CashoutHistory,
    schema: cashoutHistorySchema,
  },
  {
    name: AdminDBModel.PendingCashOutRequest,
    schema: pendingCashoutRequestSchema,
  },
  {
    name: AdminDBModel.ApproveCashOutRequest,
    schema: approveCashoutSchema,
  },
  {
    name: AdminDBModel.Leaderboard,
    schema: leaderboardSchema,
  },
  {
    name: AdminDBModel.LeaderboardSet,
    schema: leaderboardSetSchema,
  },
  {
    name: AdminDBModel.ScratchCardHistory,
    schema: scratchCardHistorySchema,
  },
  {
    name: AdminDBModel.BonusCollection,
    schema: bonusCollectionSchema,
  },
  {
    name: AdminDBModel.ScratchCardPending,
    schema: scratchCardPendingSchema,
  },
  {
    name: AdminDBModel.PromoBonus,
    schema: promoBonusSchema,
  },
  {
    name: AdminDBModel.InstantChipsPulledHistory,
    schema: InstantChipsPulledHistorySchema,
  },
  {
    name: AdminDBModel.Deposit,
    schema: depositSchema,
  },
  {
    name: AdminDBModel.RakeReport,
    schema: rakeReportSchema
  },
  {
    name: AdminDBModel.RakebackPlayerHistory,
    schema: rakebackPlayerHistorySchema
  },
  {
    name: AdminDBModel.RakebackConfiguration,
    schema: rakebackConfigurationSchema
  },
  {
    name: AdminDBModel.RakebackHistory,
    schema: rakebackHistorySchema
  }
  //financeDB
  // {
  //   name: AdminDBModel.Fundrake,
  //   schema: fundrakeSchema,
  // },
];
// export class AdminDb extends MongooseModule {
//   static forFeature(models?: ModelDefinition[]): DynamicModule {
//     return super.forFeature(models, ConnectionNames.PokerAdminDb);
//   }

//   static forFeatureWithModels(modelNames: AdminDBModel[]): DynamicModule {
//     return super.forFeature(
//       AdminDBModels.filter(
//         (x) => modelNames.indexOf(x.name as AdminDBModel) > -1,
//       ),
//       ConnectionNames.PokerAdminDb,
//     );
//   }

//   static forRootAsync(options?: MongooseModuleAsyncOptions): DynamicModule {
//     return super.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         uri: `${configService.get<string>('MONGO_DB_URI')}/${getDBUri(
//           'pokerAdminDb',
//         )}`,
//       }),
//       inject: [ConfigService],
//       connectionName: ConnectionNames.PokerAdminDb,
//       ...options,
//     });
//   }
// }

// export const getAdminModelToken = (model: AdminDBModel) => {
//   console.log('sdfsdfsdfsd')
//   return getModelToken(model, ConnectionNames.PokerAdminDb)
// }

export const InjectAdminModel = (model: AdminDBModel) =>
  InjectModel(model, ConnectionNames.PokerAdminDb);
