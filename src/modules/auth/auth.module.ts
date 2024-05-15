import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ForgotPasswordController } from './forgot-password/forgot-password.controller';
import { ResetPasswordController } from './reset-password/reset-password.controller';
import { AdminDBModel } from '@/database/connections/admin-db';
import { DB } from '@/database/connections/db';
// import { MongooseModule } from '@nestjs/mongoose';
// import affiliates, { affiliatesSchema } from '@/v1/model/schema/affiliates';
@Module({
  imports: [
    // MongooseModule.forFeature([{
    //   name: affiliates.name,
    //   schema: affiliatesSchema,
    // }]
    // // 'pokerAdminDb'
    // ),
    DB.adminDbModels([AdminDBModel.Affiliates, AdminDBModel.LoggedInAffiliate]),
  ],
  controllers: [
    AuthController,
    ForgotPasswordController,
    ResetPasswordController,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
