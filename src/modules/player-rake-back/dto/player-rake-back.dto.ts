import { ApiProperty } from '@nestjs/swagger';

export class PlayerRakeBackDto {
  @ApiProperty({
    example: Date.now(),
  })
  endDate: number;

  @ApiProperty({
    example: Date.now(),
  })
  startDate: number;

  @ApiProperty()
  rakeByUsername: string;

  @ApiProperty()
  limit?: number;

  @ApiProperty()
  skip?: number;
}
