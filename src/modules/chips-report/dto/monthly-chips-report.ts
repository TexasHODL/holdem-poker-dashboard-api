import { ApiProperty } from '@nestjs/swagger';

export class MonthlyChipsReport {
  @ApiProperty({
    description: 'The date of the report',
  })
  date: { $gte: number; $lt: number };

  @ApiProperty()
  startDate?: any;

  @ApiProperty()
  endDate?: any;
}
