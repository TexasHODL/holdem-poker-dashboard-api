import { ApiProperty } from '@nestjs/swagger';

export class CountRakebackData {
  @ApiProperty({
    example: Date.now(),
    required: false,
  })
  endTime?: number;

  @ApiProperty({
    example: Date.now(),
    required: false,
  })
  startTime?: number;

  @ApiProperty({
    required: false,
  })
  filterPlayer?: string;

  @ApiProperty({
    required: false,
  })
  filterReferenceNo?: string;

  @ApiProperty({
    required: false,
  })
  parentUser?: string;
}
