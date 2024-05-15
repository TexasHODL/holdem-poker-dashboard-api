import { ApiProperty } from '@nestjs/swagger';

export class InstantBonusHistoryQueryDto {
  @ApiProperty({
    required: false,
  })
  userName?: string;
  @ApiProperty({
    required: false,
  })
  parentUserName?: string;
  @ApiProperty({
    required: false,
  })
  type?: string;
  @ApiProperty({
    required: false,
  })
  promoCode?: string;
  @ApiProperty({
    required: false,
  })
  skip?: number;
  @ApiProperty({
    required: false,
  })
  limit?: number;
}
