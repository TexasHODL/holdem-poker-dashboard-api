import { ApiProperty } from '@nestjs/swagger';

export class BuildAccessDto {
  @ApiProperty()
  androidApp: boolean;

  @ApiProperty()
  iosApp: boolean;

  @ApiProperty()
  mac: boolean;

  @ApiProperty()
  browser: boolean;

  @ApiProperty()
  windows: boolean;

  @ApiProperty()
  website: boolean;
}
