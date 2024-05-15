import { ApiProperty } from '@nestjs/swagger';

export class PlayerBuildAccessDto {
  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mobile: number;
}
