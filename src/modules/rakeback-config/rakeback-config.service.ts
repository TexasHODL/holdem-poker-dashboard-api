import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import axios from 'axios';

@Injectable()
export class RakebackConfigService extends CrudService {
    constructor(
        @InjectAdminModel(AdminDBModel.RakebackConfiguration)
        protected readonly model: Model<any>,
    ) {
        super(model);
    }

    listRakeBack () {
        return this.model.find({})
    }
  
    editRakeback (query: Request) {
        console.log("inside editRakeback", query);
        console.log('inside getAccount');
    
        axios({
            url: "http://localhost:4141/listRakeBackManagement",
            method: "post",
        }).then((response)=>{
            console.log(response);
        }).catch(err=>{
            console.log(err)
        });
        return this.model.update({}, { $set: query });
    }
}
  