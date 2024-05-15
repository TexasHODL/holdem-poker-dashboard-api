import { ApiProperty } from '@nestjs/swagger';

export class ListRakebackData {
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

  @ApiProperty()
  limit?: number;

  @ApiProperty()
  skip?: number;
}
