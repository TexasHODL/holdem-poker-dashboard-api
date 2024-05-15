import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstantBonusHistoryDocument = InstantBonusHistory & Document;

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
})
export class InstantBonusHistory {
  @Prop({
    required: true,
  })
  userName: string;
  @Prop()
  amount?: number;
  @Prop({
    required: true,
  })
  type: string;
  @Prop()
  time?: number;
  @Prop()
  comments?: string;
  @Prop()
  parentUserName?: string;
  @Prop()
  promoCode?: string;
  @Prop()
  lockedBonusAmount?: number;
  @Prop()
  bonusChipsType?: string;
}

export const InstantBonusHistorySchema =
  SchemaFactory.createForClass(InstantBonusHistory);
