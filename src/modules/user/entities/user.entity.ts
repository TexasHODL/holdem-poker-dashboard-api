import { Prop } from '@nestjs/mongoose';

export class UserRole {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  level: number;
}

export class User {}
