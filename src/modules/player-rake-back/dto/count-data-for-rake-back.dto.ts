import { ApiProperty } from '@nestjs/swagger';

export class CountDataForRakeBackDto {
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
}
