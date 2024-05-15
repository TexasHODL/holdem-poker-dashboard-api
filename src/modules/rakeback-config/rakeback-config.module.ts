import { Module } from '@nestjs/common';
import { RakebackConfigService } from './rakeback-config.service';
import { RakebackConfigController } from './rakeback-config.controller';
import { DB } from '@/database/connections/db';
import { AdminDBModel } from '@/database/connections/admin-db';

@Module({
  imports: [
    DB.adminDbModels([AdminDBModel.RakebackConfiguration]),
  ],
  controllers: [RakebackConfigController],
  providers: [
    RakebackConfigService
  ]
})
export class RakebackConfigModule {}
