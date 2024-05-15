import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DirectCashoutHistoryDocument = DirectCashoutHistory & Document;

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
})
export class DirectCashoutHistory {
  @Prop({
    required: true,
  })
  userName: string;
  @Prop()
  affilateId: string;
  @Prop()
  name: string;
  @Prop()
  profile: string;
  @Prop()
  amount: number;
  @Prop()
  type: string;
  @Prop()
  actionTakenAt: number; // date int
  @Prop()
  status: string; // Approved
  @Prop()
  referenceNumber: string;
}

export const DirectCashoutHistorySchema =
  SchemaFactory.createForClass(DirectCashoutHistory);
