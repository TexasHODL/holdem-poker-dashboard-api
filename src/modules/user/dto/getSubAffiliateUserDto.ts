import { ApiProperty } from '@nestjs/swagger';

export class GetSubAffiliateUserDto {
  @ApiProperty()
  pagelimit: number;
  @ApiProperty()
  currentpage: number;
  @ApiProperty()
  isParent: string;
  @ApiProperty()
  role: string;
}
