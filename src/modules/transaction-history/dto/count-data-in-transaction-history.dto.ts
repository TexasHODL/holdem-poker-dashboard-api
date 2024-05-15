import { ApiProperty } from "@nestjs/swagger";

export class CountDataInTransactionHistoryDto {
  @ApiProperty({
    example: Date.now(),
  })
  endDate: number;

  @ApiProperty({
    example: Date.now(),
  })
  startDate: number;

  @ApiProperty()
  Name: string;

  @ApiProperty()
  bonusCode: string;

  @ApiProperty()
  referenceNumber: string;

  @ApiProperty()
  sortValue: string;

  @ApiProperty()
  transactionType: string;

  @ApiProperty()
  transferMode: string;

  @ApiProperty()
  userType: string;

  @ApiProperty()
  loginId: string;
}
