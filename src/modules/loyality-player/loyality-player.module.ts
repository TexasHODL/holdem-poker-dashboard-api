import { Module } from '@nestjs/common';
import { LoyalityPlayerService } from './loyality-player.service';
import { LoyalityPlayerController } from './loyality-player.controller';
import { DB, DBModel } from '@/database/connections/db';

@Module({
  imports: [DB.pokerDbModels([DBModel.VipAccumulation])],
  controllers: [LoyalityPlayerController],
  providers: [LoyalityPlayerService],
  exports: [LoyalityPlayerService],
})
export class LoyalityPlayerModule {}
