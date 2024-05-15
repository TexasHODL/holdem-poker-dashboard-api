import { ApiProperty } from '@nestjs/swagger';

export class TransferChipAffiliateToPlayerDto {
  @ApiProperty({
    required: true,
  })
  transferTo: string;
  @ApiProperty({
    required: true,
  })
  affiliate: string;
  @ApiProperty({
    required: true,
  })
  amount: number;
}
