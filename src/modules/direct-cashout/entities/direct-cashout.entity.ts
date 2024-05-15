import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DirectCashoutDocument = DirectCashout & Document;

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
})
export class DirectCashout {
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
}

export const DirectCashoutSchema = SchemaFactory.createForClass(DirectCashout);
