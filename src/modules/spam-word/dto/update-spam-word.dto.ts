import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSpamWordDto } from './create-spam-word.dto';

class blockedWord {
  @ApiProperty()
  text: string;
}
class blockedWordsListObject {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  blockedWords: Array<blockedWord>;
}

export class UpdateSpamWordDto extends PartialType(CreateSpamWordDto) {
  @ApiProperty()
  blockedWordsList: blockedWordsListObject;

  @ApiProperty()
  blockedWords: Array<string>;
}
