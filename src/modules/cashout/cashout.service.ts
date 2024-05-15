import { Injectable } from '@nestjs/common';
import { CreateCashoutDto } from './dto/create-cashout.dto';
import { UpdateCashoutDto } from './dto/update-cashout.dto';

@Injectable()
export class CashoutService {
  create(createCashoutDto: CreateCashoutDto) {
    return 'This action adds a new cashout';
  }

  findAll() {
    return `This action returns all cashout`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cashout`;
  }

  update(id: number, updateCashoutDto: UpdateCashoutDto) {
    return `This action updates a #${id} cashout`;
  }

  remove(id: number) {
    return `This action removes a #${id} cashout`;
  }
}
