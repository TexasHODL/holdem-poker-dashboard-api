import { ApiProperty } from '@nestjs/swagger';

export class ListMonthlyBonusChipsReport {
  @ApiProperty({
    description: 'The date of the report',
  })
  addeddate: number;
}
