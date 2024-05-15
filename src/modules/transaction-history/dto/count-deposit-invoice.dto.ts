import { ApiProperty } from "@nestjs/swagger";

export class CountDepositInvoiceDto {
  @ApiProperty({
    example: Date.now(),
  })
  createdAt: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  loginId: string;
}
