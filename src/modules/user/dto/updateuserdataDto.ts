import { ApiProperty } from '@nestjs/swagger';

export class UpdateuserdataDto {
  @ApiProperty()
  isParent: string;
  @ApiProperty()
  isParentuserName: string;
  @ApiProperty()
  isParentrole: string;
  @ApiProperty()
  isBlocked: string;
}
