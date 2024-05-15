import { ApiProperty } from "@nestjs/swagger";

export enum TransactionTypeEnum {
  debit = "debit",
  credit = "create",
}

export enum TransferModeEnum {
  funTransfer = "FUND TRANSFER",
  onlineTransfer = "ONLINE TRANSFER",
  scratchCard = "Scratch Card",
}

export enum UserTypeEnum {
  player = "PLAYER",
  agent = "AGENT",
  subAgent = "SUB-AGENT",
  affiliate = "AFFILIATE",
  subAffiliate = "SUBAFFILIATE",
}

export class ListTransactionHistoryDto {
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

  @ApiProperty({
    enum: TransactionTypeEnum,
    example: TransactionTypeEnum.credit,
  })
  transactionType: string;

  @ApiProperty({
    enum: TransferModeEnum,
    example: TransferModeEnum.funTransfer,
  })
  transferMode: string;

  @ApiProperty({
    enum: UserTypeEnum,
    example: UserTypeEnum.affiliate,
  })
  userType: string;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  loginId: string;
}
