import { ApiProperty } from '@nestjs/swagger';

export class GetCurrentDataOfBalanceSheetForDashboardDto {
  @ApiProperty({
    required: false,
  })
  date: number;
}
