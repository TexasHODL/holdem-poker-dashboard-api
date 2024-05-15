import { UserRoleDto } from '@/modules/user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DailyChipsChart {
  @ApiProperty({
    description: 'The date of the report',
  })
  addeddate: number;

  @ApiProperty({
    description: 'The date of the report',
  })
  role: UserRoleDto;

  startDate: number;

  endDate: number;

  transactionResult: any;

  currentMonthChipsData: any;

  previousMonthChipsData: any;
}
