import { ApiProperty } from '@nestjs/swagger';

export class CheckUserSessionDto {
  @ApiProperty({
    required: true,
  })
  uniqueSessionId: string;

  @ApiProperty({
    required: true,
  })
  userName: string;
}
