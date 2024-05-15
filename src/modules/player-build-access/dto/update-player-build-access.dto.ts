import { ApiProperty } from '@nestjs/swagger';
import { BuildAccessDto } from './build-access.dto';

export class UpdatePlayerBuildAcessDto {
  @ApiProperty({
    required: true,
  })
  _id: string;

  @ApiProperty()
  buildAccess: BuildAccessDto;
}
