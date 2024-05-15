import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { Injectable } from '@nestjs/common';
import { Document, Model, Types } from 'mongoose';
import { InstantBonusHistoryDto } from '../../dto/instant-bonus-history.dto';
import { InstantBonusHistoryDocument } from '../../entities/instantBonusHistory.entity';

@Injectable()
export class InstantBonusHistoryService extends CrudService<InstantBonusHistoryDocument> {
  constructor(
    @InjectDBModel(DBModel.InstantBonusHistory)
    protected readonly model: Model<InstantBonusHistoryDocument>,
  ) {
    super(model);
  }

  create({ transferType, transferAt, ...dto }: InstantBonusHistoryDto) {
    return super.create({
      ...dto,
      type: transferType,
      time: transferAt,
    });
  }

  getTotalInstantAmountTransferred(query) {
    return this.model.aggregate([
      { $match: query },
      { $group: { _id: '_id', totalAmount: { $sum: '$amount' } } },
    ]);
  }
}
