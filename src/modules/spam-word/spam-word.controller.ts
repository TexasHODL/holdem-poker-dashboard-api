import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SpamWordService } from './spam-word.service';
import { CreateSpamWordDto } from './dto/create-spam-word.dto';
import { UpdateSpamWordDto } from './dto/update-spam-word.dto';
import {
  listSpamWords,
  updateSpamWord,
} from '@/v1/controller/spamWords/spamwordsController';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Spam Management')
@ApiBearerAuth()
@Controller('')
export class SpamWordController {
  constructor(private readonly spamWordService: SpamWordService) {}

  @Post('listSpamWords')
  listSpamWords(@Req() req, @Body() dto: any) {
    return listSpamWords(req);
  }

  @Post('updateSpamWord')
  update(@Req() req, @Body() updateSpamWordDto: UpdateSpamWordDto) {
    return updateSpamWord(req);
  }
}
