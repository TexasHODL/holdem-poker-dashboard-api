import { Injectable } from '@nestjs/common';
import { CreateSpamWordDto } from './dto/create-spam-word.dto';
import { UpdateSpamWordDto } from './dto/update-spam-word.dto';

@Injectable()
export class SpamWordService {
  create(createSpamWordDto: CreateSpamWordDto) {
    return 'This action adds a new spamWord';
  }

  findAll() {
    return `This action returns all spamWord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spamWord`;
  }

  update(id: number, updateSpamWordDto: UpdateSpamWordDto) {
    return `This action updates a #${id} spamWord`;
  }

  remove(id: number) {
    return `This action removes a #${id} spamWord`;
  }
}
