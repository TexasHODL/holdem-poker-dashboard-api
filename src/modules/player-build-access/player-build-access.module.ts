import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PlayerBuildAccessController } from './player-build-access.controller';
import { PlayerBuildAccessService } from './player-build-access.service';

@Module({
  imports: [UserModule],
  controllers: [PlayerBuildAccessController],
  providers: [PlayerBuildAccessService],
})
export class PlayerBuildAccessModule {}
