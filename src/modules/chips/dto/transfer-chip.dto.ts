import { ApiProperty } from '@nestjs/swagger';

export enum TransferTransactionTypeEnum {
  Debit = 'Debit',
  Credit = 'Credit',
}

export class TransferChipDto {
  @ApiProperty({
    required: true,
  })
  transferTo: string;
  @ApiProperty({
    required: true,
  })
  amount: number;
  @ApiProperty({
    required: true,
  })
  transactionType: TransferTransactionTypeEnum;
  description?: string;
}
