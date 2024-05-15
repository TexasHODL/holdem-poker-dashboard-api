import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerBlockedRecordDocument = PlayerBlockedRecord & Document;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
    currentTime: () => Math.floor(Date.now() / 1000),
  },
})
export class PlayerBlockedRecord {
  @Prop({
    required: true,
  })
  userName: string;
  @Prop()
  playerId: string;
  @Prop()
  status: string;
  @Prop()
  freeChipsBalance: number;
  @Prop()
  realChipsBalance: number;
  @Prop()
  megaPoints: number;
  @Prop()
  megaCircle: number;
  @Prop()
  handsPlayed: number;
  @Prop()
  totalWinnings: number;
  @Prop()
  playerJoinedAt: number;
  @Prop()
  parent: string;
  @Prop()
  parentType: string;
  @Prop()
  totalRake: number;
  @Prop()
  reasonForBan: string;
}

export const PlayerBlockedRecordSchema =
  SchemaFactory.createForClass(PlayerBlockedRecord);
