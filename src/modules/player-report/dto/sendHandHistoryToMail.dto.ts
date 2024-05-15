import { ApiProperty } from '@nestjs/swagger';

export class SendHandHistoryToMailDto {
  @ApiProperty({
    required: true,
  })
  emailId: string;
  @ApiProperty({
    required: true,
  })
  finalStringFile: string;
}
