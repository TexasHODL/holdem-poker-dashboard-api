import { ApiProperty } from '@nestjs/swagger';
import { CreateNewAffiliateDto } from './createNewAffiliateDto';

export class CreateSubAffiliateDto extends CreateNewAffiliateDto {
  @ApiProperty({
    required: true,
  })
  parentUser: string;
  @ApiProperty({
    required: false,
  })
  parentName?: string;
}
