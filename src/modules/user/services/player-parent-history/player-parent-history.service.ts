import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PlayerParentHistoryService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.PlayerParentHistory)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }
}
