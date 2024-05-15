import {
    AdminDBModel,
    InjectAdminModel,
  } from '../../../database/connections/admin-db';
  import { Injectable } from '@nestjs/common';
  import { Model } from 'mongoose';
  
  @Injectable()
  export class DepositInvoiceReportService {
    constructor(
      @InjectAdminModel(AdminDBModel.Deposit)
      protected readonly depositModel: Model<any>,
    ) {}
  
    async ListDepositInvoice (query) {
        console.log("inside ListDepositInvoice", query);
        
    }
  }