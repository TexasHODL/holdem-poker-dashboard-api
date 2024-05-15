import { CrudService } from '@/core/services/crud/crud.service';
import { PokerDBModel } from '@/database/connections/constants';
import { InjectDBModel } from '@/database/connections/db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class FriendService extends CrudService {
  constructor(
    @InjectDBModel(PokerDBModel.Friend)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }
}
