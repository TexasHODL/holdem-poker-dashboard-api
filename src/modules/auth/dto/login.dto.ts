import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'Admin',
  })
  userName: '' | string;
  @ApiProperty({
    example: '3EAz0dkG',
  })
  password: '' | string;
  @ApiProperty()
  keyForRakeModules: false | boolean;
}
