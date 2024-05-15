import { ApiProperty } from '@nestjs/swagger';

export class WithdrawChipDto {
  @ApiProperty({
    required: true,
  })
  withdrawFrom: string;
  @ApiProperty({
    required: true,
  })
  affiliate: string;
  @ApiProperty({
    required: true,
  })
  amount: number;
}
