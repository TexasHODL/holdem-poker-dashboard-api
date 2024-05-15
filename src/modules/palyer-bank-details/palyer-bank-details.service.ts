import { CrudService } from '@/core/services/crud/crud.service';
import { InjectDBModel, DBModel } from '@/database/connections/db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreatePalyerBankDetailDto } from './dto/create-palyer-bank-detail.dto';
import { UpdatePalyerBankDetailDto } from './dto/update-palyer-bank-detail.dto';

@Injectable()
export class PalyerBankDetailsService extends CrudService<any> {
  constructor(
    @InjectDBModel(DBModel.PalyerBankDetails)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }
  
  // create(createPalyerBankDetailDto: CreatePalyerBankDetailDto) {
  //   return 'This action adds a new palyerBankDetail';
  // }

  findAll(query) {
    const newQuery: any = {...query};
    const skip = query.skip || 0;
    const limit = query.limit || 0;
    return this.model
    .find(newQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  }

  findOnePalyer(playerId: number) {
    return this.model.findOne({ playerId });
  }

  // update(id: number, updatePalyerBankDetailDto: UpdatePalyerBankDetailDto) {
  //   return `This action updates a #${id} palyerBankDetail`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} palyerBankDetail`;
  // }
}
