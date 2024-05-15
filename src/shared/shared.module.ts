import { Module } from '@nestjs/common';
import { MailService } from './services/mail/mail.service';
import { SocketClientService } from './services/socket-client/socket-client.service';
import { SmsService } from './services/sms/sms.service';
import { HttpModule } from '@nestjs/axios';
import { DB, DBModel } from '@/database/connections/db';
import { RequestDataService } from "./services/request-data/request-data.service";
// import { AdminDb, AdminDBModel } from '@/database/connections/admin-db';

@Module({
  imports: [
    HttpModule,
    DB.pokerDbModels([DBModel.User]),
    // DB.adminDbModels([
    //   AdminDBModel.Affiliates
    // ])
  ],
  providers: [MailService, SocketClientService, SmsService, RequestDataService],
  exports: [MailService, SocketClientService, SmsService, RequestDataService],
})
export class SharedModule {}
