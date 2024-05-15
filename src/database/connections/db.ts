import { ConnectionNames } from '@/constants/connections';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AsyncModelFactory,
  InjectModel,
  ModelDefinition,
  MongooseModule,
  MongooseModuleAsyncOptions,
} from '@nestjs/mongoose';

import { userSchema } from '@/v1/model/schema/users';
import { InstantBonusHistorySchema } from '@/modules/bonus-chips/entities/instantBonusHistory.entity';
import { bonusdataSchema } from '@/v1/model/schema/bonusdata';
import { mobileOtpSchema } from '@/v1/model/schema/mobileOtp';
import { tableSchema } from '@/v1/model/schema/tables';
import { vipAccumulationSchema } from '@/v1/model/schema/vipAccumulation';
import { spamWordsSchema } from '@/v1/model/schema/spamWords';
import { antibankingSchema } from '@/v1/model/schema/antibanking';
import { userSessionSchema } from '@/v1/model/schema/userSession';
import { pendingPasswordResetSchema } from '@/v1/model/schema/pendingPasswordResets';
import { scheduleTaskSchema } from '@/v1/model/schema/scheduleTasks';
import { leaderboardParticipantSchema } from '@/v1/model/schema/leaderboardParticipant';
import { leaderboardWinnerSchema } from '@/v1/model/schema/leaderboardWinners';
import { playerChatSchema } from '@/v1/model/schema/playerChat';
import { friendsSchema } from '@/v1/model/schema/friends';
import { ScheduledExpirySchema } from '@/modules/bonus-chips/entities/scheduled-expiry.entity';
import { AdminDBModel, AdminDBModels } from './admin-db';
import { DBModelNames, Models } from './model';
import {
  FinanceDbModel,
  InMemoryDBModel,
  LogDBModel,
  PokerDBModel,
} from './constants';
import { LogDBModels } from './log-db';
import { FinanceDBModels } from './finance-db';
import { InMemoryDBModels } from './in-memory-db';
import { getDBUri } from './helpers';
import { VipReleaseSchema } from '@/modules/user/entities/vipRelease.entity';
import { palyerBankDetailsSchema } from '@/v1/model/schema/palyerBankDetails';

export { PokerDBModel as DBModel };

export const DBModels: ModelDefinition[] = [
  {
    name: PokerDBModel.User,
    schema: userSchema,
  },
  {
    name: PokerDBModel.InstantBonusHistory,
    schema: InstantBonusHistorySchema,
  },
  {
    name: PokerDBModel.BonusData,
    schema: bonusdataSchema,
  },
  {
    name: PokerDBModel.MobileOtp,
    schema: mobileOtpSchema,
  },
  {
    name: PokerDBModel.Table,
    schema: tableSchema,
  },
  {
    name: PokerDBModel.VipAccumulation,
    schema: vipAccumulationSchema,
  },
  {
    name: PokerDBModel.SpamWord,
    schema: spamWordsSchema,
  },
  {
    name: PokerDBModel.Antibanking,
    schema: antibankingSchema,
  },
  {
    name: PokerDBModel.UserSession,
    schema: userSessionSchema,
  },
  {
    name: PokerDBModel.PendingPasswordReset,
    schema: pendingPasswordResetSchema,
  },
  {
    name: PokerDBModel.ScheduleTask,
    schema: scheduleTaskSchema,
  },
  {
    name: PokerDBModel.LeaderboardWinners,
    schema: leaderboardWinnerSchema,
  },
  {
    name: PokerDBModel.LeaderboardParticipant,
    schema: leaderboardParticipantSchema,
  },
  {
    name: PokerDBModel.PlayerChat,
    schema: playerChatSchema,
  },
  {
    name: PokerDBModel.Friend,
    schema: friendsSchema,
  },
  {
    name: PokerDBModel.ScheduledExpiry,
    schema: ScheduledExpirySchema,
  },
  {
    name: PokerDBModel.VipRelease,
    schema: VipReleaseSchema,
  },
  {
    name: PokerDBModel.PalyerBankDetails,
    schema: palyerBankDetailsSchema,
  },

];

const envUrl = {
  INMEMDB_PATH: 'mongodb://localhost:27017',
  PLAYERDB_PATH: 'mongodb://localhost:27017',
  LOGDB_PATH: 'mongodb://localhost:27017',
  FINANCEDB_PATH: 'mongodb://localhost:27017',
  ADMINDB_PATH: 'mongodb://localhost:27017'
}

export class DB extends MongooseModule {
  static forFeature(models?: ModelDefinition[]): DynamicModule {
    return super.forFeature([...DBModels, ...models], ConnectionNames.PokerDB);
  }

  static forFeatureWithModels(modelNames: PokerDBModel[]): DynamicModule {
    return super.forFeature(
      DBModels.filter((x) => modelNames.indexOf(x.name as PokerDBModel) > -1),
      ConnectionNames.PokerDB,
    );
  }

  static forFeatureModels(
    modelNames: any[],
    models: any[],
    dbName: string,
  ): DynamicModule {
    const _models = models
      .filter((x) => modelNames.indexOf(x.name) > -1)
      .map((item) => ({
        ...item,
        collection: item.collection || item.name,
      }));
    return super.forFeature(_models, dbName);
  }

  static forRootAsync(options?: MongooseModuleAsyncOptions): DynamicModule {
    return super.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get<string>('MONGO_DB_URI')}/${getDBUri(
          'pokerdb',
        )}`,
      }),
      inject: [ConfigService],
      connectionName: ConnectionNames.PokerDB,
      ...options,
    });
  }

  static dbConnectAsync(
    env,
    dbname,
    connectionName,
    options?: MongooseModuleAsyncOptions,
  ): DynamicModule {
    return DB.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: envUrl[env] + '/' + dbname,
      }),
      inject: [ConfigService],
      connectionName: connectionName,
      ...options,
    });
  }

  static pokerDb(): DynamicModule {
    return this.dbConnectAsync(
      'PLAYERDB_PATH',
      getDBUri('pokerdb'),
      ConnectionNames.PokerDB,
    );
  }

  static pokerDbModels(modelNames: PokerDBModel[]): DynamicModule {
    return DB.forFeatureModels(modelNames, DBModels, ConnectionNames.PokerDB);
    // return super.forFeature(
    //   DBModels.filter((x) => modelNames.indexOf(x.name as PokerDBModel) > -1),
    //   ConnectionNames.PokerDB,
    // );
  }

  static adminDb(): DynamicModule {
    return this.dbConnectAsync(
      'ADMINDB_PATH',
      getDBUri('pokerAdminDb'),
      ConnectionNames.PokerAdminDb,
    );
  }

  static adminDbModels(modelNames: AdminDBModel[]): DynamicModule {
    return DB.forFeatureModels(
      modelNames,
      AdminDBModels,
      ConnectionNames.PokerAdminDb,
    );
    // return super.forFeature(
    //   AdminDBModels.filter(
    //     (x) => modelNames.indexOf(x.name as AdminDBModel) > -1,
    //   ),
    //   ConnectionNames.PokerAdminDb,
    // );
  }

  static financeDb(): DynamicModule {
    return this.dbConnectAsync(
      'FINANCEDB_PATH',
      getDBUri('pokerFinancedb'),
      ConnectionNames.PokerFinanceDb,
    );
  }

  static financeDbModels(modelNames: FinanceDbModel[]): DynamicModule {
    return DB.forFeatureModels(
      modelNames,
      FinanceDBModels,
      ConnectionNames.PokerFinanceDb,
    );
    // return super.forFeature(
    //   FinanceDBModels.filter((x) => modelNames.indexOf(x.name as FinanceDbModel) > -1),
    //   ConnectionNames.PokerFinanceDb,
    // );
  }

  static logDb(): DynamicModule {
    return this.dbConnectAsync(
      'LOGDB_PATH',
      getDBUri('pokerlogadmin'),
      ConnectionNames.LogDB,
    );
  }

  static logDbModels(modelNames: LogDBModel[]): DynamicModule {
    return DB.forFeatureModels(modelNames, LogDBModels, ConnectionNames.LogDB);
    // return super.forFeature(
    //   LogDBModels.filter((x) => modelNames.indexOf(x.name as LogDBModel) > -1),
    //   ConnectionNames.LogDB,
    // );
  }

  static inMemoryDb(): DynamicModule {
    return this.dbConnectAsync(
      'INMEMDB_PATH',
      getDBUri('pokerimdb'),
      ConnectionNames.InMemoryDB,
    );
  }

  static inMemoryDbModels(modelNames: InMemoryDBModel[]): DynamicModule {
    return DB.forFeatureModels(
      modelNames,
      InMemoryDBModels,
      ConnectionNames.InMemoryDB,
    );
    // return super.forFeature(
    //   InMemoryDBModels.filter((x) => modelNames.indexOf(x.name as InMemoryDBModel) > -1),
    //   ConnectionNames.InMemoryDB,
    // );
  }
}

export const InjectDBModel = (model: PokerDBModel) =>
  InjectModel(model, ConnectionNames.PokerDB);
export const InjectFinanceDBModel = (model: DBModelNames) =>
  InjectModel(model, ConnectionNames.PokerFinanceDb);
