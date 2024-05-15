import { ApiProperty } from '@nestjs/swagger';

export enum InstantBonusHistoryTypeEnum {
  signUp = 'signUp',
  leaderboardWinnings = 'leaderboardWinnings',
  promotion = 'promotion',
}

export enum InstantBonusHistoryBonusChipsTypeEnum {
  instant = 'instant',
  locked = 'locked',
  instantAndLocked = 'instantAndLocked',
}

export class InstantBonusHistoryDto {
  @ApiProperty({
    required: true,
  })
  userName: string;
  @ApiProperty()
  amount?: number;
  @ApiProperty({
    required: true,
    enum: InstantBonusHistoryTypeEnum,
    example: InstantBonusHistoryTypeEnum.leaderboardWinnings,
    // type: Inst antBonusHistoryTypeEnum
  })
  transferType: InstantBonusHistoryTypeEnum;
  @ApiProperty({
    example: Date.now(),
  })
  transferAt?: number;
  @ApiProperty()
  comments?: string;
  @ApiProperty()
  parentUserName?: string;
  @ApiProperty()
  promoCode?: string;
  @ApiProperty()
  lockedBonusAmount?: number;
  @ApiProperty({
    enum: InstantBonusHistoryBonusChipsTypeEnum,
    example: InstantBonusHistoryBonusChipsTypeEnum.instant,
  })
  bonusChipsType?: InstantBonusHistoryBonusChipsTypeEnum;
}
