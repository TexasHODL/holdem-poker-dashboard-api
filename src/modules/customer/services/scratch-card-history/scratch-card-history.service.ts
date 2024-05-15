import { CrudService } from '@/core/services/crud/crud.service';
import { InjectAdminModel } from '@/database/connections/admin-db';
import { AdminDBModel } from '@/database/connections/constants';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ScratchCardHistoryService  extends CrudService<any> {
    constructor(
        @InjectAdminModel(AdminDBModel.ScratchCardHistory)
        protected readonly model: Model<any>,
      ) {
        super(model);
      }
}
