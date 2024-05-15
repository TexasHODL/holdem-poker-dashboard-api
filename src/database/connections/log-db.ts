import { ConnectionNames } from '@/constants/connections';
import { PlayerBlockedRecordSchema } from '@/modules/user/entities/playerBlockedRecord.entity';
import { gameActivitySchema } from '@/v1/model/schema/gameActivity';
import { handHistorySchema } from '@/v1/model/schema/handHistory';
import { playerArchiveSchema } from '@/v1/model/schema/playerArchive';
import { playerLoginDataSchema } from '@/v1/model/schema/playerLoginData';
import { tableUpdateRecordSchema } from '@/v1/model/schema/tableUpdateRecords';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { LogDBModel } from './constants';

export const LogDBModels: ModelDefinition[] = [
  {
    name: LogDBModel.PlayerBlockedRecord,
    schema: PlayerBlockedRecordSchema,
  },
  {
    name: LogDBModel.PlayerArchive,
    schema: playerArchiveSchema,
  },
  {
    name: LogDBModel.HandHistory,
    schema: handHistorySchema,
  },
  {
    name: LogDBModel.PlayerLoginData,
    schema: playerLoginDataSchema,
  },
  {
    name: LogDBModel.GameActivity,
    schema: gameActivitySchema,
  },
  {
    name: LogDBModel.TableUpdateRecord,
    schema: tableUpdateRecordSchema,
  },
];

export const InjectLogModel = (model: LogDBModel) =>
  InjectModel(model, ConnectionNames.LogDB);
