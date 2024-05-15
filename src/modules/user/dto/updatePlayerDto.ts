import { ApiProperty } from '@nestjs/swagger';
import { UserRoleDto } from './create-user.dto';

class UpdatePlayerStatistic {
  @ApiProperty()
  megaPoints: number;
  @ApiProperty()
  megaPointLevel: number;
  @ApiProperty()
  handsPlayedRM: number;
}

class UpdatePlayerChipsManagement {
  @ApiProperty()
  deposit: number;
}

export class UpdatePlayerDto {
  @ApiProperty()
  userName: string;
  @ApiProperty()
  isParentUserName: string;
  @ApiProperty()
  isParentrole: string;
  @ApiProperty()
  rakeBack: number;
  @ApiProperty({
    // type: {
    //   level: Number
    // }
  })
  userRole: UserRoleDto;
  @ApiProperty()
  loggedInUser: string;
  @ApiProperty()
  parentType: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  reasonForBan: string;
  @ApiProperty()
  freeChips: number;
  @ApiProperty()
  realChips: number;
  @ApiProperty({
    // type: {
    //   deposit: Number
    // }
  })
  chipsManagement: UpdatePlayerChipsManagement;
  @ApiProperty()
  statistics: UpdatePlayerStatistic;
}
