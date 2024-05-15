import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduledExpiryDocument = ScheduledExpiry & Document;

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
})
export class ScheduledExpiry {
  @Prop({
    required: true,
  })
  playerId: string;
  @Prop({
    required: true,
  })
  userName: string;
  @Prop({
    required: true,
  })
  mode: string;
  @Prop()
  expireAt?: number;
  @Prop()
  uniqueId?: string;
  @Prop()
  vipPoints: string;
  @Prop()
  lockedBonusAmount?: number;
  @Prop()
  vipLevel?: string;
  @Prop()
  expireStatus: number; // 0-scheduled; 1-expired; 2-cancelled;
}

export const ScheduledExpirySchema =
  SchemaFactory.createForClass(ScheduledExpiry);
