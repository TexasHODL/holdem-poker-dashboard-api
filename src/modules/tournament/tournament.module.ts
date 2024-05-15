import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { DB, DBModel } from '@/database/connections/db';

@Module({
  imports: [DB.forFeatureWithModels([DBModel.Table])],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
