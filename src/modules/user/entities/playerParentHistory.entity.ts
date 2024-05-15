import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerParentHistoryDocument = PlayerParentHistory & Document;

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
})
export class PlayerParentHistory {
  @Prop({
    required: true,
  })
  userName: string;
  @Prop()
  playerId: string;
  @Prop()
  newParent: string;
  @Prop()
  newParentType: string;
  @Prop()
  oldParent: string;
  @Prop()
  oldParentType: string;
  @Prop()
  updatedBy: string;
  @Prop()
  updatedByRole: string;
}

export const PlayerParentHistorySchema =
  SchemaFactory.createForClass(PlayerParentHistory);
