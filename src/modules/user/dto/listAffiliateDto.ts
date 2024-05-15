import { ApiProperty } from '@nestjs/swagger';
import { ListUsersDto } from './ListUsersDto';

export class ListAffiliateDto extends ListUsersDto {
  @ApiProperty({ required: false })
  userName?: string;
  @ApiProperty({ required: false })
  loginId?: string;
}
