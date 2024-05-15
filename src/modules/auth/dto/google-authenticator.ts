import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthenDto {
  @ApiProperty({
    example: 'Admin',
  })
  userName: '' | string;
  code: '' | string;
}
