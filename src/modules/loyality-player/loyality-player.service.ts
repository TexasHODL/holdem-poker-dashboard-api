import { CrudService } from '@/core/services/crud/crud.service';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateLoyalityPlayerDto } from './dto/create-loyality-player.dto';
import { UpdateLoyalityPlayerDto } from './dto/update-loyality-player.dto';

@Injectable()
export class LoyalityPlayerService extends CrudService {
  constructor(
    @InjectDBModel(DBModel.VipAccumulation)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  calculateTotalVipPoints(query) {
    console.log('Inside  listPlayerLoyalityPointsReport db query ', query);
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$userName',
          total: { $sum: '$earnedPoints' },
          totalRake: { $sum: '$rakeAmount' },
        },
      },
    ]);
  }

  listVipPoints (query, params) {
    console.log("inside listVipPoints", query);
    console.log("paramslistVipPoints ", params);
    // return this.model.find(query).skip(params.skip).limit(params.limit).sort({ date: -1 });
    return this.model.aggregate([
      { $match: query },
      { $sort: { date: -1 } },
      { $limit: params.limit || 0 },
      { $skip: params.skip || 0 }
    ]);
  }
}
