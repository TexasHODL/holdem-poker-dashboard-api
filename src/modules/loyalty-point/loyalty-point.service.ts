import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateLoyaltyPointDto } from './dto/create-loyalty-point.dto';
import { UpdateLoyaltyPointDto } from './dto/update-loyalty-point.dto';

@Injectable()
export class LoyaltyPointService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.LoyaltyPoint)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  findAllMegaPointLevels(query) {
    return this.findAllLoyaltyPoints(query);
  }

  findAllLoyaltyPoints(query) {
    return this.model.find(query).sort({ levelId: 1 }).exec();
  }
}
