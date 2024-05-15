import { CrudService } from '@/core/services/crud/crud.service';
import { LogDBModel } from '@/database/connections/constants';
import { InjectLogModel } from '@/database/connections/log-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class GameActivityService extends CrudService<any>{
    constructor(
        @InjectLogModel(LogDBModel.GameActivity)
        protected readonly model: Model<any>,
      ) {
        super(model);
      }
      
      findPlayerGameOverData(query){
        const skip = query.skip ? query.skip : 0;
        const limit = query.limit ? query.limit : 10;
        delete query.skip;
        delete query.limit;
        return this.findAll(query).skip(skip).limit(limit).sort({
          createdAt: -1
        });
    
      }
      countPlayerGameOverData(query){
        delete query.skip;
        delete query.limit;
        return this.count(query)
      }
}
