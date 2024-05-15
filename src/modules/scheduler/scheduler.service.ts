import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import * as schedule from 'node-schedule';
import { CrudService } from '@/core/services/crud/crud.service'
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { Model, Types } from 'mongoose'
import { TableService } from '@/modules/table/table.service';

@Injectable()
export class SchedulerService extends CrudService implements OnModuleInit {
    constructor(
        @InjectDBModel(DBModel.Table)
        protected readonly model: Model<any>,
        @Inject(TableService)
        protected readonly tableService: TableService,
    ) {
        super(model);
    }
    
    onModuleInit() {
        this.scheduleTask();
    }

    scheduleTask() {
        schedule.scheduleJob('*/1 * * * *', async () => {
            console.log('Scheduled task is running...');
            const tableList = await this.model.find({}).exec();
            return await this.tableService.checkLastPlayed(tableList);
        });
    }
}