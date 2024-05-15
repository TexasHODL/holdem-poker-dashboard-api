import { Module } from '@nestjs/common';
import { SpamWordService } from './spam-word.service';
import { SpamWordController } from './spam-word.controller';
import { DB, DBModel } from '@/database/connections/db';

@Module({
  imports: [DB.pokerDbModels([DBModel.SpamWord])],
  controllers: [SpamWordController],
  providers: [SpamWordService],
})
export class SpamWordModule {}
