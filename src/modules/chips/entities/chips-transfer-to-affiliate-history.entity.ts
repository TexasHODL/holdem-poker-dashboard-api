import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '@/modules/user/entities/user.entity';

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
    // currentTime: () => Math.floor(Date.now() / 1000),
  },
  collection: 'chipsTransferToAffiliateHistory',
})
export class ChipsTransferToAffiliateHistory {
  @Prop({
    required: true,
  })
  transferTo: string;
  @Prop({
    required: true,
  })
  amount: number;
  @Prop({
    required: true,
  })
  transferBy: string;
  @Prop({
    required: true,
  })
  transactionType: string;
  @Prop({
    required: false,
  })
  description: string;
  @Prop({
    required: true,
  })
  date: number;
  @Prop({
    required: true,
    type: UserRole,
  })
  role: UserRole;
  @Prop({
    required: false,
  })
  names: string;
  @Prop({
    required: true,
    type: UserRole,
  })
  loginType: UserRole;
  @Prop({
    required: true,
  })
  userType: string;
}

export const ChipsTransferToAffiliateHistorySchema =
  SchemaFactory.createForClass(ChipsTransferToAffiliateHistory);
