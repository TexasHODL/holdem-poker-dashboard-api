import { ApiProperty } from '@nestjs/swagger';

export enum TransferModeEnum {
  funTransfer = 'FUND TRANSFER',
  onlineTransfer = 'ONLINE TRANSFER',
  scratchCard = 'SCRATCH CARD',
}

export class DailyChipsReport {
  @ApiProperty({
    description: 'The date of the report',
  })
  date: { $gte: number; $lte: number };

  @ApiProperty({
    description: 'reference to the user',
  })
  referenceNumber: string;

  @ApiProperty({
    description: 'name of the user',
  })
  Name: string;

  @ApiProperty({
    description: 'The loginId',
  })
  loginId: string;

  @ApiProperty()
  names: string;

  @ApiProperty()
  userName: string;

  @ApiProperty({
    description: 'amount of chips',
  })
  amount: { $gte: number; $lte: number };

  @ApiProperty({
    description: 'The type of the report',
  })
  transferMode: TransferModeEnum;

  @ApiProperty()
  sortValue: string;

  @ApiProperty()
  startDate?: any;

  @ApiProperty()
  endDate?: any;

  @ApiProperty()
  minChips?: number;

  @ApiProperty()
  maxChips?: number;

  @ApiProperty()
  limit?: number;

  @ApiProperty()
  skip?: number;
}
