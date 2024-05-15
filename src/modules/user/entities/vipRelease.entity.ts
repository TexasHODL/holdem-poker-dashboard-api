import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VipReleaseDocument = VipRelease & Document;

@Schema({
  versionKey: false,
  // timestamps: { createdAt: true, updatedAt: true },
})
export class VipRelease {
  @Prop({
    required: true,
  })
  userName: string;
}

export const VipReleaseSchema = SchemaFactory.createForClass(VipRelease);
