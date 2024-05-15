import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type PlayerParentHistoryDocument = InstantChipsPulledHistory & Document;

@Schema({
  versionKey: false,
  timestamps: { createdAt: false, updatedAt: false },
  collection: 'instantChipsPulledHistory'
})
export class InstantChipsPulledHistory {
  @Prop({
    required: true,
  })
  userName: string;
  @Prop()
  amount: number;
  @Prop({
    type: SchemaTypes.Mixed,
  })
  pulledBy: Record<string, unknown>;
  @Prop()
  pulledByUsername: string;
  @Prop()
  reason: string;
  @Prop()
  pulledAt: number;

  // data.pulledAt = Number(new Date());
  // data.userName = params.userName;
  // data.amount = params.amount;
  // data.pulledBy = params.pulledBy;
  // data.pulledByUsername = params.pulledByName;
  // if (params.reason) data.reason = params.reason;
}

export const InstantChipsPulledHistorySchema =
  SchemaFactory.createForClass(InstantChipsPulledHistory);
