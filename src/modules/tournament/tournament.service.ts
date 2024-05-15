import { CrudService } from '@/core/services/crud/crud.service';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentService extends CrudService {
  constructor(
    @InjectDBModel(DBModel.Table)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }
}
