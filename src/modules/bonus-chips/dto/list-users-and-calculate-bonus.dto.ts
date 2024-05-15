import { ApiProperty } from '@nestjs/swagger';

export class ListUsersAndCalculateBonusDto {
  @ApiProperty({
    required: false,
  })
  userName?: string;
  @ApiProperty({
    required: false,
  })
  _id?: string;
  @ApiProperty({
    required: false,
  })
  userId?: string;
  @ApiProperty({
    required: false,
  })
  promoBonusAwarded?: boolean;
  @ApiProperty({
    required: false,
  })
  emailId?: string;
  @ApiProperty({
    required: false,
  })
  parent?: string;
  @ApiProperty({
    required: false,
  })
  isOrganic?: boolean;
  @ApiProperty({
    required: false,
  })
  status?: string;

  @ApiProperty({
    required: false,
    default: 0,
  })
  skip?: number;

  @ApiProperty({
    required: false,
    default: 0,
  })
  limit?: number;

  @ApiProperty({
    required: false,
  })
  isParentUserName?: String
}
