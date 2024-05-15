import { ApiProperty } from "@nestjs/swagger";

export class ListDepositInvoiceDto {
  @ApiProperty({
    example: Date.now(),
  })
  createdAt: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  loginId: string;
}
