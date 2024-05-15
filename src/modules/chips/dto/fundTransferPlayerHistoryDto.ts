import { ApiProperty } from '@nestjs/swagger';

// export enum FundTransferAffiliateHistoryUserTypeEnum {
//   Affiliates = 'Affiliates',
//   SubAffiliates = 'Sub-affiliates"'
// }

export class FundTransferPlayerHistoryDto {
  @ApiProperty({
    required: false,
  })
  transferTo: string;
  @ApiProperty({
    required: false,
  })
  transferBy: string;
  @ApiProperty({
    required: true,
  })
  amount: number;
  @ApiProperty({
    required: false,
  })
  transactionType?: string;
  @ApiProperty({
    required: false,
  })
  startDate?: string;
  @ApiProperty({
    required: false,
  })
  endDate?: string;
  // @ApiProperty({
  //   required: false,
  //   enum: FundTransferAffiliateHistoryUserTypeEnum,
  //   example: FundTransferAffiliateHistoryUserTypeEnum.Affiliates
  // })
  // usersType?: string;
  @ApiProperty({
    required: false,
  })
  role: {
    level: number;
  };
  @ApiProperty({
    required: false,
  })
  skip: number;
  @ApiProperty({
    required: false,
  })
  limit: number;
}
