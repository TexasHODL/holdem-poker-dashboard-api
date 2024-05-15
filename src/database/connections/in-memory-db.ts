import { ConnectionNames } from '@/constants/connections';
import { TableJoinRecordSchema } from '@/modules/table/entities/tableJoinRecord.entity';
import { tableSchema } from '@/v1/model/schema/tables';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { InMemoryDBModel } from './constants';

export const InMemoryDBModels: ModelDefinition[] = [
  {
    name: InMemoryDBModel.Table,
    schema: tableSchema,
  },
  {
    name: InMemoryDBModel.TableJoinRecord,
    schema: TableJoinRecordSchema,
  },
];

export const InjectInMemoryModel = (model: InMemoryDBModel) =>
  InjectModel(model, ConnectionNames.InMemoryDB);
