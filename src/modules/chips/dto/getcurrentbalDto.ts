import { ApiProperty } from '@nestjs/swagger';

export class GetcurrentbalDto {
  @ApiProperty({
    required: true,
  })
  role: string;
  @ApiProperty({
    required: true,
  })
  userrole: string;
}
