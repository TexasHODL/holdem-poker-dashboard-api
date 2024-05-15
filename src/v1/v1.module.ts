import { DB, DBModel } from '@/database/connections/db';
import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import affiliates, { affiliatesSchema } from './model/schema/affiliates';
import { userSchema } from './model/schema/users';

@Module({
  imports: [
    // MongooseModule.forFeature([{
    //   name: affiliates.name,
    //   schema: affiliatesSchema
    // }]),
    DB.forFeature([
      {
        name: DBModel.User,
        schema: userSchema,
      },
    ]),
  ],
  providers: [],
  controllers: [],
})
export class V1Module {}
