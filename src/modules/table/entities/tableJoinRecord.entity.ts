import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
  // timestamps: {
  //   // createdAt: true,
  //   // updatedAt: true,
  //   // currentTime: () => Math.floor(Date.now() / 1000),
  // },
  timestamps: false,
  collection: 'tableJoinRecord',
})
export class TableJoinRecord {
  @Prop({
    required: true,
  })
  createdAt: number;
  @Prop({
    required: true,
  })
  updatedAt: number;
}

export const TableJoinRecordSchema =
  SchemaFactory.createForClass(TableJoinRecord);
