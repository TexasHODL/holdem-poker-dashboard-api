import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DB, DBModel } from '@/database/connections/db';
import { AdminDBModel } from '@/database/connections/constants';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports:[
    DB.pokerDbModels([
      DBModel.PlayerChat
    ]),
    DB.adminDbModels([
      // AdminDBModel.Affiliates,
      // AdminDBModel.ModuleAdmin,
      // AdminDBModel.ModuleAffiliate,
      // AdminDBModel.PlayerParentHistory,
    ]),
  ]
})
export class ChatModule {}
