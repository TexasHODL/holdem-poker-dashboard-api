import { ApiProperty } from '@nestjs/swagger';

export enum TableChannelTypeEnum {
  Normal = 'NORMAL',
}
export class ListTableDto {
  @ApiProperty({ required: false })
  _id: string;
  @ApiProperty({ required: false })
  channelName?: string;
  @ApiProperty({ required: false })
  isActive?: boolean;
  @ApiProperty({ required: false })
  isPrivateTabel?: boolean | 'All';
  @ApiProperty({ required: false })
  minSmallBlind?: number;
  @ApiProperty({ required: false })
  maxSmallBlind?: number;
  @ApiProperty({ required: false })
  minBuyInMin?: number;
  @ApiProperty({ required: false })
  minBuyInMax?: number;
  @ApiProperty({ required: false })
  minPlayerLimit?: number;
  @ApiProperty({ required: false })
  maxPlayerLimit?: number;
  @ApiProperty({ required: false })
  turnTime?: number;
  @ApiProperty({ required: false })
  isRealMoney?: boolean;
  @ApiProperty({ required: false })
  skip?: number;
  @ApiProperty({ required: false })
  limit?: number;
  @ApiProperty()
  channelType: TableChannelTypeEnum;
  @ApiProperty({ required: false })
  channelVariation?: string;
  @ApiProperty({ required: false })
  chipsType?: boolean;
}
