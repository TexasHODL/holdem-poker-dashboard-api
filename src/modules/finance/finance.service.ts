import { Injectable } from '@nestjs/common';
import { query } from 'express';
import { CrudService } from '@/core/services/crud/crud.service';
import {
    FinanceDbModel,
    InjectFinanceModel,
} from '@/database/connections/finance-db';
import { Model } from 'mongoose';

@Injectable()
export class FinanceService extends CrudService {
    constructor(
        @InjectFinanceModel(FinanceDbModel.BalanceSheet)
        protected readonly model: Model<any>,
    ) {
        super(model);
    }
    
}
